# 🧠 Price Oracle for Liquidity Pool Analysis

A TypeScript-based tool to analyze liquidity pools for **ETH**, **USDT**, and **DAI** across **Uniswap**, **SushiSwap**, and **Curve**.

---

## 📌 Overview

The Price Oracle project is designed to analyze and compare liquidity pools across major decentralized exchanges (DEXs). It calculates token price ratios, computes multiple statistical averages, picks the most reliable price ratio, and ranks pools based on mock security/reputation metrics.

---

## 🎯 Key Objectives

- 🔍 **Analyze 9 Liquidity Pools**: 3 tokens × 3 platforms = 9 total pools.
- 🧩 **DEX Focus**: Emphasizes Uniswap, but includes SushiSwap and Curve.
- 🧮 **Ratio Calculation**: `reserveB / reserveA` (e.g., USDC/ETH).
- 📊 **10 Statistical Averages**: Arithmetic, geometric, median, etc.
- 📌 **"Most Correct" Ratio**: Volume-weighted average for each token.
- ✅ **Single Ratio Selection**: Based on the pool with highest 24h volume.
- 🔐 **Reputation Ranking**: Uses mock audit, hack history, and age to rank pools.

---

## ⚙️ Features

- 🧾 **Liquidity Pool Details**: Shows token pairs, reserves, volume, and platform.
- 🔁 **Ratio Calculation**: Computes price of tokenB per tokenA.
- 📈 **10 Statistical Averages**:
  - Arithmetic Mean
  - Geometric Mean
  - Median
  - Weighted Mean (by Volume)
  - Harmonic Mean
  - Midrange
  - Trimmed Mean (10%)
  - Mode
  - Quadratic Mean (RMS)
  - Max Ratio
- ✅ **Volume-Weighted "Most Correct" Ratios**: For ETH, USDT, and DAI.
- 📌 **Single Ratio Selection**: From the highest-volume pool.
- 🔐 **Security & Reputation Ranking**:
  - Formula: `score = 50 * hasAudit - 20 * hackHistory + platformAge`

---

## 🚀 Getting Started

### ✅ Prerequisites

- Node.js v14 or higher
- TypeScript
- npm

### 📦 Setup Instructions

```bash
git clone <repository-url>
cd price-oracle
npm install typescript ts-node
