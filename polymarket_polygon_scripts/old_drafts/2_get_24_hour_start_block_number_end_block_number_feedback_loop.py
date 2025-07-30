import requests
import json
import time
import datetime
import sys

# CLI argument
# if len(sys.argv) != 2:
#     print("Usage: python3 script.py YYYY-MM-DD")
#     sys.exit(1)
#
# date_str = sys.argv[1]

# Read current block number from which we are going back 
with open("current_polygon_block.json", "r") as f:
    data = json.load(f)
    current_polygon_block_number = data["current_polygon_block"]
    current_polygon_block_unix = data["unix_timestamp"]

# Interactive question rather than CLI argument
date_str = input("Input date for calculating 24 hour trade volume (DD-MM-YYYY): ")

# Calculating the target unix timestamp according to input
try: 
    target_date = datetime.datetime.strptime(date_str, "%d-%m-%Y").replace(tzinfo=datetime.timezone.utc)
    input_date = target_date.replace(tzinfo=datetime.timezone.utc)
    target_unix = int(input_date.timestamp())
    print("Target UNIX timestamp: ", target_unix)
except ValueError:
    print("Invalid date format. Use DD-MM-YYYY (e.g. 01-03-2025)")
    sys.exit(1)

# Calculating the target block according to the input
#    Current date referring to the last stamped block
current_date = datetime.datetime.fromtimestamp(current_polygon_block_unix, tz=datetime.timezone.utc)
days_difference = (current_date - target_date).days
lower_bound_start = current_polygon_block_number - 81143 * days_difference

# Calculating the 24 hour end unix timestamp
target_end_24hr_date_unix = target_unix + 86400  # 86400 seconds in 24 hours

# Our Polymarket Polygon RPC endpoint connection data
RPC_URL = "https://polygon-rpc.com"
CONTRACT_ADDRESS = "0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E"
FILL_ORDER_TOPIC = "0xc4109843e91b0e58c301f796291ac4de7cbcf77d8dff9ab6466e420e4a8cb28c"

# get the target block timestamps 
def get_block_timestamps(block_number):
    block_payload = {
        "jsonrpc": "2.0",
        "method": "eth_getBlockByNumber",
        "params": [hex(block_number)],
        "id": 1
    }

    try:
        time.sleep(0.2)
        response = requests.post(RPC_URL, json=block_payload)
        result = response.json().get("result")
        if result is None:
            print(f"Block number {block_number} not found.")
            return 0
        return int(result["timestamp"], 16)
    except Exception as e:
        print(f"Error fetching block {block_number} timestamp: {e}")
        return 0

# Binary search to find the target block number by timestamp
def find_block_before_timestamp(target_ts, low_block, high_block):
    while low_block <= high_block:
        mid = (low_block + high_block) // 2
        ts = get_block_timestamps(mid)

        if ts == 0:
            break  # skip if block fetch failed

        if ts < target_ts:
            low_block = mid + 1
        elif ts > target_ts:
            high_block = mid - 1
        else:
            return mid  # exact match

    return high_block  # closest block before target


# Estimate lower bound and validate
estimated_start = current_polygon_block_number - int(43000 * days_difference)
search_low = max(0, estimated_start - 1000)

guessed_block = find_block_before_timestamp(target_unix, search_low, current_polygon_block_number)


# Initial guess
guessed_block = find_block_before_timestamp(target_unix, search_low, current_polygon_block_number)
seconds_off = guessed_ts - target_unix
blocks_off = max(1, abs(seconds_off // avg_block_time))  # Always move at least 1

# Inputs
guess_block = guessed_block  # use output of binary search
avg_block_time = 2  # or calculate dynamically
guess_seconds = get_block_timestamps(guess_block)

# Loop until you find a block whose timestamp crosses target
found = False
max_attempts = 50  # prevent infinite loops
attempts = 0

while not found and attempts < max_attempts:
    seconds_diff = target_unix - guess_seconds
    estimated_blocks_to_move = seconds_diff // avg_block_time

    if estimated_blocks_to_move == 0:
        estimated_blocks_to_move = 1 if seconds_diff > 0 else -1

    next_block = guess_block + estimated_blocks_to_move
    next_seconds = get_block_timestamps(next_block)

    print(f"🔍 Guess block {guess_block} → {guess_seconds} | Next block {next_block} → {next_seconds}")

    if (guess_seconds < target_unix < next_seconds) or (guess_seconds > target_unix > next_seconds):
        # We've crossed the target
        guess_block = next_block
        guess_seconds = next_seconds
        found = True
    elif guess_seconds == target_unix:
        found = True
    else:
        # Update guess and continue
        guess_block = next_block
        guess_seconds = next_seconds

    attempts += 1

print(f"✅ Final aligned block: {guess_block} → Timestamp: {guess_seconds}")

# Final result
start_block = guessed_block
print(f"✅ Found aligned start block: {start_block} @ {guessed_ts}")


# Binary search to find the target block number by timestamp
def get_block_timestamp(block_number):
    # Replace this with actual timestamp fetching logic
    return dummy_blockchain[block_number]  # placeholder

# Inputs
guess_block = 15
target_seconds = int(input("Enter target_seconds: "))
avg_block_time = 2  # average seconds per block

# Initial timestamp
guess_seconds = get_block_timestamp(guess_block)

# Start loop
while True:
    print(f"🔍 Guess block {guess_block} → Timestamp {guess_seconds}")

    seconds_diff = target_seconds - guess_seconds
    estimated_blocks_to_move = round(seconds_diff / avg_block_time)

    # Ensure at least one block movement
    if estimated_blocks_to_move == 0:
        estimated_blocks_to_move = 1 if seconds_diff > 0 else -1

    # Move to new block
    next_block = guess_block + estimated_blocks_to_move
    next_seconds = get_block_timestamp(next_block)

    # Check for convergence condition: target_seconds is between current and next
    if (guess_seconds < target_seconds < next_seconds) or \
       (guess_seconds > target_seconds > next_seconds):
        # We've passed over the target; next_block is the first one over target
        guess_block = next_block
        guess_seconds = next_seconds
        break_condition_met = True
    elif guess_seconds == target_seconds:
        break_condition_met = True
    else:
        # Not yet there, keep going
        guess_block = next_block
        guess_seconds = next_seconds
        break_condition_met = False

    # Stop only when we've converged
    if break_condition_met:
        print(f"✅ Final block: {guess_block} → Timestamp: {guess_seconds}")
        # loop ends naturally here
        break

start_block = find_block_before_timestamp(target_unix, lower_bound_start, current_polygon_block_number)
end_block = find_block_after_timestamp(target_end_24hr_date_unix, start_block, current_polygon_block_number)

start_ts = get_block_timestamps(start_block)
end_ts = get_block_timestamps(end_block)

# Continue safely
end_block = find_block_after_timestamp(target_unix + 86400, start_block, current_polygon_block_number)


print("Start block:", start_block)
print("End block:", end_block)

# Save all block numbers in the 24-hour range to a JSON file
block_numbers = list(range(start_block, end_block + 1))

with open("block_numbers_target_range_24_hr_value_target.json", "w") as f:
    json.dump({
        "start_block": start_block,
        "end_block": end_block,
        "block_numbers": block_numbers
    }, f, indent=2)
