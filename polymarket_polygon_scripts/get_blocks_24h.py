import requests
import json
import time
import datetime
import sys

print("🚀 Starting block search script...")

# Interactive question rather than CLI argument
date_str = input("Input date for calculating 24 hour trade volume (DD-MM-YYYY): ")
chainid = "137" # Polygon

# Calculating the target unix timestamp according to input
try: 
    target_date = datetime.datetime.strptime(date_str, "%d-%m-%Y").replace(tzinfo=datetime.timezone.utc)
    input_date = target_date.replace(tzinfo=datetime.timezone.utc)
    target_unix = int(input_date.timestamp())
    print("🎯 Target UNIX timestamp: ", target_unix)
    
    # Check if date is in the future
    current_time = datetime.datetime.now(datetime.timezone.utc)
    if target_date > current_time:
        print(f"⚠️ Warning: {date_str} is in the future!")
        print(f"   Current date: {current_time.strftime('%d-%m-%Y')}")
        print(f"   Target date: {target_date.strftime('%d-%m-%Y')}")
        print("   Did you mean a past date? (e.g., 15-07-2024 instead of 15-07-2025?)")
        
        response = input("Continue anyway? (y/n): ")
        if response.lower() != 'y':
            sys.exit(1)
            
except ValueError:
    print("❌ Invalid date format. Use DD-MM-YYYY (e.g. 01-03-2024)")
    sys.exit(1)

# Calculate 24 hour end timestamp
target_end_24hr_date_unix = target_unix + 86400  # 86400 seconds in 24 hours
print(f"⏰ 24-hour end timestamp: {target_end_24hr_date_unix}")

# Use Etherscan API for Polygon
def find_blocks():
    """
    Use Etherscan API to find blocks by timestamp for Polygon
    Requires API key from https://etherscan.io/apis
    """
    API_KEY = "GETUROWN"
    BASE_URL = "https://api.etherscan.io/v2/api"
    
    def get_block_timestamp(block_number):
        """Get the actual timestamp of a block"""
        # Use RPC call instead
        rpc_payload = {
            "jsonrpc": "2.0",
            "method": "eth_getBlockByNumber",
            "params": [hex(block_number), False],
            "id": 1
        }
        
        try:
            response = requests.post("https://polygon-rpc.com", json=rpc_payload, timeout=10)
            result = response.json().get("result")
            if result and result.get("timestamp"):
                return int(result["timestamp"], 16)
            return None
        except Exception as e:
            print(f"❌ Error getting block {block_number} timestamp: {e}")
            return None
    
    # Get start block by timestamp (first block at or after target time)
    params = {
        "chainid": chainid,  # Polygon chain ID
        "module": "block",
        "action": "getblocknobytime",
        "timestamp": str(target_unix),
        "closest": "after",  # Get first block at or after target time
        "apikey": API_KEY
    }
    
    try:
        print("🔍 Querying Etherscan API for start block...")
        response = requests.get(BASE_URL, params=params, timeout=10)
        data = response.json()
        
        if data["status"] == "1":
            start_block = int(data["result"])
            print(f"✅ Found start block: {start_block}")
            
            # Verify the start block timestamp
            start_ts = get_block_timestamp(start_block)
            if start_ts:
                start_date = datetime.datetime.fromtimestamp(start_ts, tz=datetime.timezone.utc)
                print(f"📅 Start block timestamp: {start_date.strftime('%d-%m-%Y %H:%M:%S UTC')}")
                if start_ts < target_unix:
                    print(f"⚠️ Warning: Start block is before target date!")
            
            # Get end block (last block at or before end time)
            params["timestamp"] = str(target_end_24hr_date_unix)
            params["closest"] = "before"
            
            print("🔍 Querying Etherscan API for end block...")
            response = requests.get(BASE_URL, params=params, timeout=10)
            data = response.json()
            
            if data["status"] == "1":
                end_block = int(data["result"])
                print(f"✅ Found end block: {end_block}")
                
                # Verify the end block timestamp
                end_ts = get_block_timestamp(end_block)
                if end_ts:
                    end_date = datetime.datetime.fromtimestamp(end_ts, tz=datetime.timezone.utc)
                    print(f"📅 End block timestamp: {end_date.strftime('%d-%m-%Y %H:%M:%S UTC')}")
                    if end_ts > target_end_24hr_date_unix:
                        print(f"⚠️ Warning: End block is after target end date!")
                
                return start_block, end_block
            else:
                print(f"❌ End block API call failed: {data.get('message', 'Unknown error')}")
        else:
            print(f"❌ Start block API call failed: {data.get('message', 'Unknown error')}")
        
        return None, None
        
    except Exception as e:
        print(f"❌ Error with Etherscan API: {e}")
        return None, None

# Find the blocks
print("\n🔍 Finding blocks using Etherscan API...")
start_block, end_block = find_blocks()

if start_block is None or end_block is None:
    print("❌ Could not find valid blocks")
    sys.exit(1)

print("\n📊 Final Results:")
print("Start block:", start_block)
print("End block:", end_block)
print(f"Total blocks in range: {end_block - start_block + 1}")

# Save all block numbers in the 24-hour range to a JSON file
block_numbers = list(range(start_block, end_block + 1))

print(f"💾 Saving {len(block_numbers)} block numbers to JSON file...")
with open("block_numbers_target_range_24_hr_value_target.json", "w") as f:
    json.dump({
        "start_block": start_block,
        "end_block": end_block,
        "block_numbers": block_numbers
    }, f, indent=2)

print("✅ Script completed successfully!")

