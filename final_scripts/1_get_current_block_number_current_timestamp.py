# Assess TVL of Polymarket
# TO assess TVL:
#    Get all Tokens split but not yet merged or redeemed, reflecting open positions (active bets), using the:
#    Conditional Tokens Contract (CTF)
#    on Polygon Address: 0x4D97DCd97eC945f40cF65F87097ACe5EA0476045


import requests
import json
import time

now = int(time.time())
target_unix_start = 1752537600  # July 15 2025 00:00:00 UTC 
target_unix_end = 1752624000    # July 15 2025 00:00:00 UTC 

# Step 1: Get current block number
payload = {
    "jsonrpc": "2.0",
    "method": "eth_blockNumber",
    "params": [],
    "id": 1
}

res = requests.post("https://polygon-rpc.com", json=payload)
block_hex = res.json()['result']
current_block = int(block_hex, 16)

# Step 2: Get block details for the current block
block_payload = {
    "jsonrpc": "2.0",
    "method": "eth_getBlockByNumber",
    "params": [hex(current_block), False],
    "id": 1
}

res = requests.post("https://polygon-rpc.com", json=block_payload)
block_data = res.json()['result']
block_timestamp = int(block_data["timestamp"], 16)

print("Current Polygon block:", current_block)
print("UNIX Timestamp:", block_timestamp)

# Save to file
with open("current_polygon_block.json", "w") as f:
    json.dump(
        {
            "current_polygon_block": current_block,
            "unix_timestamp": block_timestamp
        }, f, indent=2)