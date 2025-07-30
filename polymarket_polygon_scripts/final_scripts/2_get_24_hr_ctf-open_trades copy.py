import requests
import json
import time
import datetime
import sys

# ==== CONFIG ====
API_KEY = "PCKRG6E9ACP1U1D6DHWYUX8C27V3HU5B79"  # Replace this
CHAIN_ID = "137"  # Polygon
ETHERSCAN_URL = "https://api.etherscan.io/api"
POLYGON_RPC = "https://polygon-rpc.com"
FILL_ORDER_TOPIC = "0xd0a08e8c493f9c94f29311604c9de1b4e8c8d4c06bd0c789af57f2d65bfec0f6"
CONTRACT_ADDRESS = "0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E"
URL = "https://api.etherscan.io/api?module=contract&action=getabi&address={CONTRACT_ADDRESS}&apikey={API_KEY}"

print("🚀 Starting 24 hr trade volume insight script...")

# === Test Etherscan API connection ===
try:
    test_url = f"{ETHERSCAN_URL}?module=contract&action=getabi&address={CONTRACT_ADDRESS}&apikey={API_KEY}"
    res = requests.get(test_url, timeout=5)
    if res.status_code == 200:
        result = res.json()
        if result.get("status") == "1":
            print("✅ Etherscan connection successful (ABI fetched).")
        else:
            print(f"⚠️ Etherscan connected but returned error: {result.get('message')}")
    else:
        print(f"❌ Etherscan ping failed with HTTP status: {res.status_code}")
except Exception as e:
    print(f"❌ Etherscan connection error: {e}")


# === INPUT ===
polygon_contract_address = input("Input contract address (default: 0x4bFb...): ") or CONTRACT_ADDRESS
fill_order_topic = input("Input FILL_ORDER_TOPIC (default: 0xd0a0...): ") or FILL_ORDER_TOPIC

# === Define throttle ===
def throttled_post(payload):
    time.sleep(0.4)
    return requests.post(POLYGON_RPC, json=payload)

# === Load block range ===
open("block_numbers_target_range_24_hr_value_target.json", "r") as f:
    data = json.load(f)
    block_numbers = data["block_numbers"]
    start_block = block_numbers[0]
    end_block = block_numbers[-1]
print(f"📦 Block range loaded: {start_block} → {end_block}")

# === Query Fill Orders ===
print("🔍 Querying logs from Polygon RPC...")
try:
    response = throttled_post({
        "jsonrpc": "2.0",
        "method": "eth_getLogs",
        "params": [{
            "fromBlock": hex(start_block),
            "toBlock": hex(end_block),
            "address": polygon_contract_address,
            "topics": [fill_order_topic]
        }],
        "id": 1
    })

    logs = response.json().get("result", [])
    print(f"✅ Retrieved {len(logs)} FillOrder logs")

    for log in logs:
        print(f"🧾 TX: {log.get('transactionHash')} | Block: {log.get('blockNumber')}")
        print(f"    Data (raw): {log.get('data')}")

    print("\n📊 Summary:")
    print(f"Total FillOrder logs in 24h block range: {len(logs)}")
    print("✅ Script completed successfully!")

except Exception as e:
    print(f"❌ Error querying logs: {e}")
