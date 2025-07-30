from web3 import Web3
from web3.middleware import geth_poa_middleware

w3 = Web3(Web3.HTTPProvider("https://polygon-rpc.com"))
w3.middleware_onion.inject(geth_poa_middleware, layer=0)

print("Chain ID:", w3.eth.chain_id)
