import requests
import json
import time
from web3 import Web3
from datetime import datetime
from web3.middleware import geth_poa_middleware
from eth_utils import keccak
from eth_abi.abi import decode

# ✅ Load ABI
with open("contractABI.json") as f:
    abi = json.load(f)
print(f"✅ Loaded ABI with {len(abi)} entries.")

contract_address = "0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E"
web3 = Web3(Web3.HTTPProvider("https://polygon-rpc.com"))
contract = web3.eth.contract(address=contract_address, abi=abi)

print(contract.events.OrderFilled().abi)

event_signature = "OrderFilled(bytes32,address,address,uint256,uint256,uint256,uint256,uint256)"
event_hash = keccak(text=event_signature).hex()
print("🔑 Keccak for 'OrderFilled':", (event_hash))

# just liked it looked clean
#sig = "OrderFilled(bytes32,address,address,uint256,uint256,uint256,uint256,uint256)"
#print(keccak(text=sig).hex())

# ==== CONFIG ====
API_KEY = "PCKRG6E9ACP1U1D6DHWYUX8C27V3HU5B79"
CHAIN_ID = "137"
ETHERSCAN_URL = "https://api.etherscan.io/api"
POLYGON_RPC = "https://polygon-rpc.com"
FILL_ORDER_TOPIC = "0xd0a08e8c493f9c94f29311604c9de1b4e8c8d4c06bd0c789af57f2d65bfec0f6"
CONTRACT_ADDRESS = "0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E"

# ✅ Web3 init
w3 = Web3(Web3.HTTPProvider(POLYGON_RPC))
w3.middleware_onion.inject(geth_poa_middleware, layer=0)

print("🚀 Starting 24 hr trade volume insight script...")

# === INPUT ===
polygon_contract_address = input("Input contract address (default: 0x4bFb...): ") or CONTRACT_ADDRESS
fill_order_topic = input("Input FILL_ORDER_TOPIC (default: 0xd0a0...): ") or FILL_ORDER_TOPIC

# === RPC throttling ===
def throttled_post(payload):
    time.sleep(0.4)
    return requests.post(POLYGON_RPC, json=payload)

try:
    # === Load block range ===
    with open("block_numbers_target_range_24_hr_value_target.json", "r") as f:
        data = json.load(f)
        block_numbers = data["block_numbers"]
        start_block = block_numbers[0]
        end_block = block_numbers[-1]
    print(f"📦 Block range loaded: {start_block} → {end_block}")

    # === Timestamps ===
    start_ts = w3.eth.get_block(start_block)["timestamp"]
    end_ts = w3.eth.get_block(end_block)["timestamp"]
    print(f"🕒 Start block timestamp: {start_ts} ({datetime.utcfromtimestamp(start_ts)})")
    print(f"🕒 End block timestamp:   {end_ts} ({datetime.utcfromtimestamp(end_ts)})")

    # ✅ Use this for file naming
    DATE = start_ts

    # === Log query loop ===
    BLOCK_STEP = 2000
    all_logs = []
    decoded_fills = []  # ✅ Initialize decoded fills list
    total_fill = 0

    for from_block in range(start_block, end_block + 1, BLOCK_STEP):
        to_block = min(from_block + BLOCK_STEP - 1, end_block)
        print(f"🔄 Querying block range: {from_block} → {to_block}")

        response = throttled_post({
            "jsonrpc": "2.0",
            "method": "eth_getLogs",
            "params": [{
                "fromBlock": hex(from_block),
                "toBlock": hex(to_block),
                "address": polygon_contract_address,
                "topics": [FILL_ORDER_TOPIC]
            }],
            "id": 1
        })
        try: 
            result = response.json()

        except Exception as e:
            print("❌ Failed to parse JSON response:")
            print(response.text)
            print(f"Reason: {e}")
            continue  

        if "result" in result:
            logs = result["result"]
            all_logs.extend(logs)
            #print("🔍 First raw log entry:")
            #print(json.dumps(all_logs[0], indent=2))

            with open(f"polymarket_24h_{datetime.utcfromtimestamp(DATE).strftime('%Y-%m-%d')}_tradefills_log.json", "w") as f:
                json.dump(all_logs[0], f, indent=2)
            print("✅ Saved logs to file at first log success.")
                
            for log in logs: 
                if log["data"] == "0x9":
                    print("MMMAlformed log ")
                    print(json.dumps(log, indent=2))
                    continue
                
                if not log.get("data", "").startswith("0x") or len(log["data"]) < 10:
                    print("MALLLformed log (data too short or mising):")
                    print(json.dumps(log, indent=2))
                    continue

                try:
                    data_hex = log['data'][2:] #striping the hash down
                    data_bytes = bytes.fromhex(data_hex)

                    # Decode  the unindexed fields (otherwise known as data), must match the order of the emitted paramaters/args as within the ABI
                    # (bytes32,address,address,uint256,uint256,uint256,uint256,uint256)
                    # bytes32 = not data field, it is a topics field, because it is indexed. 
                    # We are only decoding the values that are not in topics. They are data fields i.e log['data']
                    decoded = decode(
                        ['uint256', 'uint256', 'uint256', 'uint256', 'uint256'],
                        data_bytes
                    )

                except Exception as e:
                    print("Failed to decode log ['data], skipping.")
                    print(f"Reason: {e}")
                    print(json.dumps(log, indent=2))
                    continue
                
                makerAssetId, takerAssetId, makerAmountFilled, takerAmountFilled, fee = decoded
                
                total_fill += takerAmountFilled

                decoded_fills.append({
                    "orderhash": log['topics'][1],
                    "maker": Web3.to_checksum_address("0x" + log['topics'][2][-40]),
                    "taker": Web3.to_checksum_address("0x" + log['topics'][3][-40]),
                    "makerAssetId": makerAssetId,
                    "takerAssetId": takerAssetId,
                    "makerAmountFilled": makerAmountFilled, 
                    "takerAmountFilled": takerAmountFilled, 
                    "fee": fee, 
                    "txHash": log['transactionHash'],
                    "blockNumber": int(log['blockNumber'], 16)
                })

        else:
            print(f"⚠️ RPC error in block range {from_block}–{to_block}: {result.get('error', {}).get('message')}")

    # === Save files ===
    #print(f"💾 Saving {len(decoded_fills)} decoded fills to JSON file...")
    #with open(f"polymarket_24h_{datetime.utcfromtimestamp(DATE).strftime('%Y-%m-%d')}_tradefills_log.json", "w") as f:
    #    json.dump(all_logs, f, indent=2)


    with open(f"polymarket_24h_{datetime.utcfromtimestamp(DATE).strftime('%Y-%m-%d')}_summary_tradefills_log.json", "w") as f:
        json.dump({
            "start_block": start_block,
            "end_block": end_block,
            "total_fill": total_fill
        }, f, indent=2)


    # === Decode and summarize ===
    print(f"✅ Retrieved total logs: {len(all_logs)}")

    if all_logs:
        print("🔍 First raw log entry:")
        print(json.dumps(all_logs[0], indent=2))
        
    else:
        print("⚠️ No logs found.")

except Exception as e:
    print(f"❌ Error querying logs: {e}")

print("✅ Script completed successfully!")
