import json
import requests 
import sys
import time

print("🚀 Starting 24 hr trade volume insight script...")

# Load block range from existing file
with open("block_numbers_target_range_24_hr_value_target.json", "r") as f:
    data = json.load(f)
    block_numbers = data["block_numbers"]
    start_block = block_numbers[0]
    end_block = block_numbers[-1]

print(f"📦 Block range loaded: {start_block} → {end_block}")

# User input for contract and topic
polygon_contract_address = input("Input contract address (default: 0x4bFb...): ") or "0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E"
fill_order_topic = input("Input FILL_ORDER_TOPIC (default: 0xc410...): ") or "0xd0a08e8c493f9c94f29311604c9de1b4e8c8d4c06bd0c789af57f2d65bfec0f6"

def throttled_post(payload):
    time.sleep(0.4)
    return requests.post("https://polygon-rpc.com", json=payload)

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

