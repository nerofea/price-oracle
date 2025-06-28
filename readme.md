Price Oracle for Liquidity Pool Analysis
Overview
The Price Oracle project is a TypeScript-based tool designed to analyze liquidity pools for decentralized exchanges (DEXs). It focuses on three cryptocurrencies (ETH, USDT, DAI) across three platforms (Uniswap, SushiSwap, Curve), calculating price ratios, various statistical averages, volume-weighted "most correct" ratios, and a reputation-based ranking system for the pools. The project uses mock data to simulate 24-hour trading volumes and pool reserves, with provisions for future integration with Uniswap's GraphQL API.
This project fulfills the following objectives:

Analyze Liquidity Pools: Define 9 liquidity pools (3 per cryptocurrency: ETH, USDT, DAI) across Uniswap, SushiSwap, and Curve.
DEX Selection: Use Uniswap as the primary DEX, showcasing mock volume data.
Ratio Calculation: Compute reserveB / reserveA ratios for each pool.
Statistical Averages: Calculate 10 types of averages for the ratios (arithmetic mean, geometric mean, etc.).
Most Correct Ratio: Determine volume-weighted ratios for each cryptocurrency.
Single Ratio Selection: Select the ratio from the pool with the highest trading volume.
Reputation Ranking: Rank pools based on mock reputation/security metrics (audit status, hack history, platform age).

Features

Liquidity Pool Analysis: Displays details for 9 pools, including token pairs, reserves, 24h trading volume, and platform.
Ratio Calculations: Computes reserveB / reserveA for each pool, representing the price of tokenB per tokenA.
Statistical Averages: Calculates 10 types of averages for ratios:
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


Most Correct Ratios: Computes volume-weighted average ratios for ETH, USDT, and DAI, prioritizing pools with higher trading volumes.
Single Ratio Selection: Selects the ratio from the pool with the highest 24h trading volume (e.g., USDT/USDC on Uniswap).
Reputation-Based Ranking: Ranks pools using a scoring system based on mock data for audit status (+50 points if true), hack history (-20 points per hack), and platform age (+1 point per month).
Verification: Validates the pool distribution (3 pools per token, 3 pools per platform).

Prerequisites

Node.js: Version 14 or higher.
TypeScript: Installed globally or as a project dependency.
npm: For installing dependencies.

Setup Instructions

Clone the Repository:
git clone <repository-url>
cd price-oracle


Install Dependencies:Ensure package.json includes TypeScript and ts-node. Install them:
npm install typescript ts-node


Directory Structure:
price-oracle/
├── src/
│   └── crypto_analysis.ts
├── package.json
├── tsconfig.json
└── README.md


Configure TypeScript:Ensure tsconfig.json exists with the following (create if missing):
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
Run the analysis script to see the output for all features:
npx ts-node src/crypto_analysis.ts

Example Output
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
  Reserves: 1,500.5 ETH / 3,000,000 USDC
  Ratio (USDC/ETH): 1999.33
  Price: 1 ETH = 1999.33 USDC
...

=== Ratio Averages ===
Average Ratios (reserveB / reserveA):
  arithmeticMean: 666.79
  geometricMean: 2.33
  median: 1.00
  weightedMeanByVolume: 468.46
  ...
  maxRatio: 1999.50

=== Most Correct Ratios ===
Most Correct Ratios by tokenA:
  ETH: 1999.15
  USDT: 0.80
  DAI: 0.69

=== Picked Ratio ===
Selected Ratio (Highest Volume):
  Token Pair: USDT/USDC
  Platform: Uniswap
  Ratio (USDC/USDT): 1.00
  Price: 1 USDT = 1.00 USDC
  Volume (24h): $50,000,000

=== Liquidity Pool Rankings (Reputation/Security) ===
Rank 1: ETH/USDC on Uniswap
  Score: 86
  Audit: true, Hacks: 0, Age: 36 months
  Volume (24h): $25,000,000
...

Code Structure

File: src/crypto_analysis.ts
Key Components:
Interfaces:
LiquidityPool: Defines pool properties (tokenA, tokenB, reserveA, reserveB, volume, platform, hasAudit, hackHistory, platformAge).
RatioResult: Stores pool, ratio, token pair, and price per tokenA.
PoolRanking: Stores pool, score, and rank for reputation ranking.


Functions:
calculateRatios: Computes reserveB / reserveA for each pool.
calculateAverages: Computes 10 types of averages for ratios.
calculateMostCorrectRatio: Calculates volume-weighted ratios per tokenA.
pickOneRatio: Selects the ratio from the highest-volume pool.
assignMockReputationData: Assigns mock values for audit, hacks, and platform age.
rankPoolsByReputation: Ranks pools by a score (hasAudit: +50, hackHistory: -20 per hack, platformAge: +1 per month).
Display functions: Format and log results (displayLiquidityPools, displayRatios, displayAverages, displayMostCorrectRatio, displayPickedRatio, displayPoolRankings).





Future Improvements

API Integration: Fetch real-time data (volume, reserves) from Uniswap’s GraphQL API (https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3) using axios.
Real Reputation Data: Replace mock hasAudit, hackHistory, and platformAge with data from sources like DeFiLlama.
Visualization: Add charts (e.g., bar chart of pool rankings) using a library like Chart.js or a canvas-based tool.
Refined Averages: Filter extreme ratios (e.g., < 0.01) to improve geometric mean accuracy.
Type Consistency: Align hackHistory type (number | null vs. boolean | null) with test specifications if needed.

Notes

The project uses mock data for volumes, reserves, and reputation metrics. Real data can be integrated by adding API calls.
The ranking system uses a simple scoring formula (50 * hasAudit - 20 * hackHistory + platformAge). Adjust weights or criteria for different priorities.
The geometric mean is sensitive to small ratios (e.g., 0.0005 for USDT/ETH). Consider filtering in future iterations.

License
MIT License. See LICENSE for details.
Contact
For questions or contributions, open an issue or submit a pull request on GitHub.
