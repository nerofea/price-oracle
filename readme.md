Price Oracle for Liquidity Pool Analysis
A TypeScript-based tool to analyze liquidity pools for ETH, USDT, and DAI across Uniswap, SushiSwap, and Curve.

Overview
The Price Oracle is a TypeScript project designed to analyze liquidity pools on decentralized exchanges (DEXs). It focuses on three cryptocurrencies—ETH, USDT, and DAI—across three platforms: Uniswap, SushiSwap, and Curve. The tool calculates price ratios, statistical averages, volume-weighted "most correct" ratios, selects a single ratio from the highest-volume pool, and ranks pools based on reputation and security metrics. Currently, it uses mock data for volumes, reserves, and reputation metrics, with provisions for future integration with Uniswap's GraphQL API.
Key Objectives

Analyze 9 Liquidity Pools: 3 pools each for ETH, USDT, and DAI across Uniswap, SushiSwap, and Curve.
DEX Selection: Uses Uniswap as the primary DEX, showcasing mock 24h trading volume data.
Ratio Calculation: Computes reserveB / reserveA for each pool (price of tokenB per tokenA).
Statistical Averages: Calculates 10 types of averages for ratios (arithmetic mean, geometric mean, etc.).
Most Correct Ratio: Determines volume-weighted ratios for each cryptocurrency.
Single Ratio Selection: Picks the ratio from the pool with the highest 24h trading volume.
Reputation Ranking: Ranks pools using a score based on mock audit status, hack history, and platform age.


Features

Liquidity Pool Details: Displays token pairs, reserves, 24h trading volume, and platform for 9 pools.
Price Ratios: Computes reserveB / reserveA for each pool (e.g., USDC/ETH: ~1999.33).
10 Statistical Averages:
Arithmetic Mean
Geometric Mean
Median
Weighted Mean (by volume)
Harmonic Mean
Midrange
Trimmed Mean (10% trim)
Mode
Quadratic Mean (RMS)
Max Ratio


Most Correct Ratios: Volume-weighted average ratios for ETH, USDT, and DAI (e.g., ETH: ~1999.15).
Single Ratio Selection: Selects the ratio from the highest-volume pool (e.g., USDT/USDC on Uniswap, ratio: 1.00).
Reputation-Based Ranking: Ranks pools with a score formula: 50 * hasAudit - 20 * hackHistory + platformAge.
Verification: Ensures 3 pools per token and platform, with a total of 9 pools.


Prerequisites

Node.js: Version 14 or higher.
TypeScript: Installed globally or as a project dependency.
npm: For managing dependencies.


Setup

Clone the Repository:
git clone <repository-url>
cd price-oracle


Install Dependencies:Ensure package.json includes typescript and ts-node. Install them:
npm install typescript ts-node


Project Structure:
price-oracle/
├── src/
│   └── crypto_analysis.ts
├── package.json
├── tsconfig.json
└── README.md


Configure TypeScript:Create or verify tsconfig.json:
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}




Usage
Run the analysis script to view all outputs:
npx ts-node src/crypto_analysis.ts

Sample Output
=== Liquidity Pools Analysis ===
Pool 1:
  Tokens: ETH/USDC
  Platform: Uniswap
  Reserves: 1,500.5 ETH / 3,000,000 USDC
  Volume (24h): $25,000,000
  Security: Audit=null, Hacks=null, Age=null months
...

=== Pool Distribution Verification ===
ETH pools: 3 (Expected: 3)
USDT pools: 3 (Expected: 3)
DAI pools: 3 (Expected: 3)
Total pools: 9 (Expected: 9)
...

=== Ratio Calculations (reserveB / reserveA) ===
Pool 1: ETH/USDC
  Platform: Uniswap
  Ratio (USDC/ETH): 1999.33
  Price: 1 ETH = 1999.33 USDC
...

=== 10 Types of Averages for Ratios ===
1. Arithmetic Mean: 666.79
2. Geometric Mean: 2.33
3. Median: 1.00
4. Weighted Mean (by Volume): 468.46
...

=== Most Correct Ratios (Volume-Weighted) ===
ETH: 1999.15
USDT: 0.80
DAI: 0.69

=== Highest Volume Ratio Selection ===
Selected Ratio (Highest Volume Pool):
  Token Pair: USDT/USDC
  Platform: Uniswap
  Ratio (USDC/USDT): 1.00
  Volume (24h): $50,000,000

=== Security & Reputation Rankings ===
Rank 1: ETH/USDC on Uniswap
  Score: 86
  Audit: true, Hacks: 0, Age: 36 months
...


Code Structure

File: src/crypto_analysis.ts
Interfaces:
LiquidityPool: Defines pool properties (tokenA, tokenB, reserveA, reserveB, volume, platform, hasAudit, hackHistory, platformAge).
RatioResult: Stores pool, ratio, token pair, and price.
PoolRanking: Stores pool, score, and rank for reputation ranking.


Key Functions:
calculateRatios: Computes reserveB / reserveA.
calculateAverages: Computes 10 types of averages.
calculateMostCorrectRatio: Calculates volume-weighted ratios per tokenA.
pickOneRatio: Selects the highest-volume pool’s ratio.
assignMockReputationData: Assigns mock audit, hack, and age data.
rankPoolsByReputation: Ranks pools by score.
display* functions: Format and log results.




Future Enhancements

Uniswap API Integration: Fetch real-time volume and reserve data using Uniswap’s GraphQL API (https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3).
Real Reputation Data: Source audit status, hack history, and platform age from DeFiLlama or similar.
Visualization: Create charts (e.g., pool rankings or ratios) using Chart.js or a canvas tool.
Refined Averages: Filter extreme ratios (e.g., < 0.01) for better geometric mean accuracy.
Type Consistency: Align hackHistory (number | null vs. boolean | null) with test specifications.


License
MIT License. See LICENSE for details.

Contributing
Contributions are welcome! Please open an issue or submit a pull request on GitHub.

Contact
For questions or feedback, open an issue on the GitHub repository.
