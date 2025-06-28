

// TASK: Interface for LiquidityPool with all required properties
interface LiquidityPool {
  tokenA: string;
  tokenB: string;
  reserveA: number;
  reserveB: number;
  volume: number; 
  platform: string;
  hasAudit: boolean | null; 
  hackHistory: number | null; 
  platformAge: number | null; 
}

// TASK: Interface for RatioResult with pool and ratio (reserveB / reserveA)
interface RatioResult {
  pool: LiquidityPool;
  ratio: number; // reserveB / reserveA
  tokenPair: string; // e.g., "ETH/USDC"
  pricePerTokenA: number; // How much of tokenB for 1 tokenA
}

// TASK: Interface for ranked pool results (security/reputation ranking)
interface RankedPool {
  pool: LiquidityPool;
  score: number;
  rank: number;
  securityDetails: {
    hasAudit: boolean;
    hackHistory: number;
    platformAge: number;
  };
}

// TASK: ALGORITHM - Calculate reserveB / reserveA for each liquidity pool
function calculateRatios(pools: LiquidityPool[]): RatioResult[] {
  return pools.map(pool => {
    const ratio = pool.reserveB / pool.reserveA;
    const tokenPair = `${pool.tokenA}/${pool.tokenB}`;
    const pricePerTokenA = ratio; // How much of tokenB for 1 tokenA
    
    return {
      pool,
      ratio,
      tokenPair,
      pricePerTokenA
    };
  });
}

// TASK: HARD - Define exactly 9 LiquidityPool objects for 3 cryptocurrencies: ETH, USDT, DAI (3 pools each)
// TASK: EASY - Use platforms Uniswap, SushiSwap, Curve that showcase volume data
// TASK: LAST - Set hasAudit, hackHistory, platformAge to null as placeholders for security ranking
const liquidityPools: LiquidityPool[] = [
  // ETH pools (3 pools)
  {
    tokenA: "ETH",
    tokenB: "USDC",
    reserveA: 1500.5,
    reserveB: 3000000,
    volume: 25000000,
    platform: "Uniswap",
    hasAudit: null,
    hackHistory: null,
    platformAge: null
  },
  {
    tokenA: "ETH",
    tokenB: "USDT",
    reserveA: 1200.3,
    reserveB: 2400000,
    volume: 18000000,
    platform: "SushiSwap",
    hasAudit: null,
    hackHistory: null,
    platformAge: null
  },
  {
    tokenA: "ETH",
    tokenB: "DAI",
    reserveA: 800.7,
    reserveB: 1600000,
    volume: 12000000,
    platform: "Curve",
    hasAudit: null,
    hackHistory: null,
    platformAge: null
  },

  // USDT pools (3 pools)
  {
    tokenA: "USDT",
    tokenB: "USDC",
    reserveA: 5000000,
    reserveB: 5000000,
    volume: 50000000,
    platform: "Uniswap",
    hasAudit: null,
    hackHistory: null,
    platformAge: null
  },
  {
    tokenA: "USDT",
    tokenB: "DAI",
    reserveA: 3000000,
    reserveB: 3000000,
    volume: 30000000,
    platform: "SushiSwap",
    hasAudit: null,
    hackHistory: null,
    platformAge: null
  },
  {
    tokenA: "USDT",
    tokenB: "ETH",
    reserveA: 2000000,
    reserveB: 1000.2,
    volume: 20000000,
    platform: "Curve",
    hasAudit: null,
    hackHistory: null,
    platformAge: null
  },

  // DAI pools (3 pools)
  {
    tokenA: "DAI",
    tokenB: "USDC",
    reserveA: 4000000,
    reserveB: 4000000,
    volume: 40000000,
    platform: "Uniswap",
    hasAudit: null,
    hackHistory: null,
    platformAge: null
  },
  {
    tokenA: "DAI",
    tokenB: "USDT",
    reserveA: 1500000,
    reserveB: 1500000,
    volume: 15000000,
    platform: "SushiSwap",
    hasAudit: null,
    hackHistory: null,
    platformAge: null
  },
  {
    tokenA: "DAI",
    tokenB: "ETH",
    reserveA: 2500000,
    reserveB: 1250.8,
    volume: 25000000,
    platform: "Curve",
    hasAudit: null,
    hackHistory: null,
    platformAge: null
  }
];

// TASK: Display all liquidity pools
function displayLiquidityPools(): void {
  console.log("=== Liquidity Pools Analysis ===\n");
  
  liquidityPools.forEach((pool, index) => {
    console.log(`Pool ${index + 1}:`);
    console.log(`  Tokens: ${pool.tokenA}/${pool.tokenB}`);
    console.log(`  Platform: ${pool.platform}`);
    console.log(`  Reserves: ${pool.reserveA.toLocaleString()} ${pool.tokenA} / ${pool.reserveB.toLocaleString()} ${pool.tokenB}`);
    console.log(`  Volume (24h): $${pool.volume.toLocaleString()}`);
    console.log(`  Security: Audit=${pool.hasAudit}, Hacks=${pool.hackHistory}, Age=${pool.platformAge} months`);
    console.log("");
  });
}

// TASK: Verify pool distribution (3 pools per currency, 3 platforms)
function verifyPoolDistribution(): void {
  console.log("=== Pool Distribution Verification ===\n");
  
  // Count pools by token
  const ethPools = getPoolsByToken("ETH");
  const usdtPools = getPoolsByToken("USDT");
  const daiPools = getPoolsByToken("DAI");
  
  console.log(`ETH pools: ${ethPools.length} (Expected: 3)`);
  console.log(`USDT pools: ${usdtPools.length} (Expected: 3)`);
  console.log(`DAI pools: ${daiPools.length} (Expected: 3)`);
  console.log(`Total pools: ${liquidityPools.length} (Expected: 9)\n`);
  
  // Count pools by platform
  const uniswapPools = getPoolsByPlatform("Uniswap");
  const sushiswapPools = getPoolsByPlatform("SushiSwap");
  const curvePools = getPoolsByPlatform("Curve");
  
  console.log(`Uniswap pools: ${uniswapPools.length} (Expected: 3)`);
  console.log(`SushiSwap pools: ${sushiswapPools.length} (Expected: 3)`);
  console.log(`Curve pools: ${curvePools.length} (Expected: 3)\n`);
  
  // Verify all requirements are met
  const allRequirementsMet = 
    ethPools.length === 3 && 
    usdtPools.length === 3 && 
    daiPools.length === 3 &&
    uniswapPools.length === 3 &&
    sushiswapPools.length === 3 &&
    curvePools.length === 3;
  
  console.log(`✅ All requirements met: ${allRequirementsMet}`);
}

// Helper function to get pools by platform
function getPoolsByPlatform(platform: string): LiquidityPool[] {
  return liquidityPools.filter(pool => pool.platform === platform);
}

// Helper function to get pools by token
function getPoolsByToken(token: string): LiquidityPool[] {
  return liquidityPools.filter(pool => pool.tokenA === token || pool.tokenB === token);
}

// TASK: Display ratio calculations (reserveB / reserveA)
function displayRatios(): void {
  console.log("=== Ratio Calculations (reserveB / reserveA) ===\n");
  
  const ratios = calculateRatios(liquidityPools);
  
  ratios.forEach((ratio, index) => {
    console.log(`Pool ${index + 1}: ${ratio.tokenPair}`);
    console.log(`  Platform: ${ratio.pool.platform}`);
    console.log(`  Reserves: ${ratio.pool.reserveA.toLocaleString()} ${ratio.pool.tokenA} / ${ratio.pool.reserveB.toLocaleString()} ${ratio.pool.tokenB}`);
    console.log(`  Ratio (${ratio.pool.tokenB}/${ratio.pool.tokenA}): ${ratio.ratio.toFixed(4)}`);
    console.log(`  Price: 1 ${ratio.pool.tokenA} = ${ratio.pricePerTokenA.toFixed(2)} ${ratio.pool.tokenB}`);
    console.log("");
  });
}

// TASK: EASY - Calculate 10 different types of averages for ratios
function calculateAverages(ratios: RatioResult[]): Record<string, number> {
  const ratioValues = ratios.map(r => r.ratio);
  const volumeValues = ratios.map(r => r.pool.volume);
  
  // 1. Arithmetic Mean
  const arithmeticMean = ratioValues.reduce((sum, val) => sum + val, 0) / ratioValues.length;
  
  // 2. Geometric Mean
  const geometricMean = Math.pow(ratioValues.reduce((product, val) => product * val, 1), 1 / ratioValues.length);
  
  // 3. Median
  const sortedRatios = [...ratioValues].sort((a, b) => a - b);
  const median = sortedRatios.length % 2 === 0 
    ? (sortedRatios[sortedRatios.length / 2 - 1] + sortedRatios[sortedRatios.length / 2]) / 2
    : sortedRatios[Math.floor(sortedRatios.length / 2)];
  
  // 4. Weighted Mean (by volume)
  const totalVolume = volumeValues.reduce((sum, vol) => sum + vol, 0);
  const weightedMean = ratioValues.reduce((sum, ratio, index) => sum + (ratio * volumeValues[index]), 0) / totalVolume;
  
  // 5. Harmonic Mean
  const harmonicMean = ratioValues.length / ratioValues.reduce((sum, val) => sum + (1 / val), 0);
  
  // 6. Midrange
  const minRatio = Math.min(...ratioValues);
  const maxRatio = Math.max(...ratioValues);
  const midrange = (minRatio + maxRatio) / 2;
  
  // 7. Trimmed Mean (10% trim)
  const trimCount = Math.floor(ratioValues.length * 0.1);
  const trimmedRatios = sortedRatios.slice(trimCount, -trimCount);
  const trimmedMean = trimmedRatios.reduce((sum, val) => sum + val, 0) / trimmedRatios.length;
  
  // 8. Mode (most frequent value)
  const frequencyMap = new Map<number, number>();
  ratioValues.forEach(val => {
    frequencyMap.set(val, (frequencyMap.get(val) || 0) + 1);
  });
  const mode = Array.from(frequencyMap.entries()).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  
  // 9. Quadratic Mean (RMS)
  const quadraticMean = Math.sqrt(ratioValues.reduce((sum, val) => sum + val * val, 0) / ratioValues.length);
  
  // 10. Max Ratio
  const maxRatioValue = Math.max(...ratioValues);
  
  return {
    arithmeticMean,
    geometricMean,
    median,
    weightedMean,
    harmonicMean,
    midrange,
    trimmedMean,
    mode,
    quadraticMean,
    maxRatio: maxRatioValue
  };
}

// TASK: Display all 10 types of averages
function displayAverages(): void {
  console.log("=== 10 Types of Averages for Ratios ===\n");
  
  const ratios = calculateRatios(liquidityPools);
  const averages = calculateAverages(ratios);
  
  console.log(`1. Arithmetic Mean: ${averages.arithmeticMean.toFixed(4)}`);
  console.log(`2. Geometric Mean: ${averages.geometricMean.toFixed(4)}`);
  console.log(`3. Median: ${averages.median.toFixed(4)}`);
  console.log(`4. Weighted Mean (by Volume): ${averages.weightedMean.toFixed(4)}`);
  console.log(`5. Harmonic Mean: ${averages.harmonicMean.toFixed(4)}`);
  console.log(`6. Midrange: ${averages.midrange.toFixed(4)}`);
  console.log(`7. Trimmed Mean (10% trim): ${averages.trimmedMean.toFixed(4)}`);
  console.log(`8. Mode: ${averages.mode.toFixed(4)}`);
  console.log(`9. Quadratic Mean (RMS): ${averages.quadraticMean.toFixed(4)}`);
  console.log(`10. Max Ratio: ${averages.maxRatio.toFixed(4)}\n`);
}

// TASK: HARD - Assess combination of ratio values to calculate the most correct ratio value
// Using volume-weighted average for each token pair
function calculateMostCorrectRatio(): Record<string, number> {
  const ratios = calculateRatios(liquidityPools);
  
  // Group ratios by tokenA
  const ethRatios = ratios.filter(r => r.pool.tokenA === "ETH");
  const usdtRatios = ratios.filter(r => r.pool.tokenA === "USDT");
  const daiRatios = ratios.filter(r => r.pool.tokenA === "DAI");
  
  // Calculate volume-weighted average for each token
  const calculateWeightedAverage = (tokenRatios: RatioResult[]) => {
    const totalVolume = tokenRatios.reduce((sum, r) => sum + r.pool.volume, 0);
    return tokenRatios.reduce((sum, r) => sum + (r.ratio * r.pool.volume), 0) / totalVolume;
  };
  
  return {
    ETH: calculateWeightedAverage(ethRatios),
    USDT: calculateWeightedAverage(usdtRatios),
    DAI: calculateWeightedAverage(daiRatios)
  };
}

// TASK: Display most correct ratios
function displayMostCorrectRatios(): void {
  console.log("=== Most Correct Ratios (Volume-Weighted) ===\n");
  
  const ratios = calculateRatios(liquidityPools);
  const mostCorrectRatios = calculateMostCorrectRatio();
  
  // ETH Pools
  const ethRatios = ratios.filter(r => r.pool.tokenA === "ETH");
  const ethTotalVolume = ethRatios.reduce((sum, r) => sum + r.pool.volume, 0);
  
  console.log("ETH Pools:");
  ethRatios.forEach(ratio => {
    const weight = (ratio.pool.volume / ethTotalVolume * 100).toFixed(1);
    console.log(`  Pool: ${ratio.tokenPair} on ${ratio.pool.platform}`);
    console.log(`    Ratio: ${ratio.ratio.toFixed(4)} (Weight: ${weight}%)`);
  });
  console.log(`  🎯 Most Correct Ratio: ${mostCorrectRatios.ETH.toFixed(4)}\n`);
  
  // USDT Pools
  const usdtRatios = ratios.filter(r => r.pool.tokenA === "USDT");
  const usdtTotalVolume = usdtRatios.reduce((sum, r) => sum + r.pool.volume, 0);
  
  console.log("USDT Pools:");
  usdtRatios.forEach(ratio => {
    const weight = (ratio.pool.volume / usdtTotalVolume * 100).toFixed(1);
    console.log(`  Pool: ${ratio.tokenPair} on ${ratio.pool.platform}`);
    console.log(`    Ratio: ${ratio.ratio.toFixed(4)} (Weight: ${weight}%)`);
  });
  console.log(`  🎯 Most Correct Ratio: ${mostCorrectRatios.USDT.toFixed(4)}\n`);
  
  // DAI Pools
  const daiRatios = ratios.filter(r => r.pool.tokenA === "DAI");
  const daiTotalVolume = daiRatios.reduce((sum, r) => sum + r.pool.volume, 0);
  
  console.log("DAI Pools:");
  daiRatios.forEach(ratio => {
    const weight = (ratio.pool.volume / daiTotalVolume * 100).toFixed(1);
    console.log(`  Pool: ${ratio.tokenPair} on ${ratio.pool.platform}`);
    console.log(`    Ratio: ${ratio.ratio.toFixed(4)} (Weight: ${weight}%)`);
  });
  console.log(`  🎯 Most Correct Ratio: ${mostCorrectRatios.DAI.toFixed(4)}\n`);
}

// TASK: EASY - Pick one ratio value (highest volume pool)
function pickHighestVolumeRatio(): RatioResult {
  const ratios = calculateRatios(liquidityPools);
  
  // Find the ratio with the highest volume
  let highestVolumeRatio = ratios[0];
  let maxVolume = ratios[0].pool.volume;
  
  ratios.forEach(ratio => {
    if (ratio.pool.volume > maxVolume) {
      maxVolume = ratio.pool.volume;
      highestVolumeRatio = ratio;
    }
  });
  
  return highestVolumeRatio;
}

// TASK: Display the selected highest volume ratio
function displayHighestVolumeRatio(): void {
  console.log("=== Highest Volume Ratio Selection ===\n");
  
  const selectedRatio = pickHighestVolumeRatio();
  
  console.log("🎯 Selected Ratio (Highest Volume Pool):");
  console.log(`  Token Pair: ${selectedRatio.tokenPair}`);
  console.log(`  Platform: ${selectedRatio.pool.platform}`);
  console.log(`  24h Volume: $${selectedRatio.pool.volume.toLocaleString()}`);
  console.log(`  Reserves: ${selectedRatio.pool.reserveA.toLocaleString()} ${selectedRatio.pool.tokenA} / ${selectedRatio.pool.reserveB.toLocaleString()} ${selectedRatio.pool.tokenB}`);
  console.log(`  Ratio (${selectedRatio.pool.tokenB}/${selectedRatio.pool.tokenA}): ${selectedRatio.ratio.toFixed(4)}`);
  console.log(`  Price: 1 ${selectedRatio.pool.tokenA} = ${selectedRatio.pricePerTokenA.toFixed(2)} ${selectedRatio.pool.tokenB}`);
  console.log("");
  
  // Show comparison with other pools
  const ratios = calculateRatios(liquidityPools);
  console.log("📊 Volume Comparison (All Pools):");
  ratios.forEach((ratio, index) => {
    const isSelected = ratio === selectedRatio;
    const marker = isSelected ? "⭐" : "  ";
    console.log(`${marker} Pool ${index + 1}: ${ratio.tokenPair} on ${ratio.pool.platform}`);
    console.log(`     Volume: $${ratio.pool.volume.toLocaleString()} | Ratio: ${ratio.ratio.toFixed(4)}`);
  });
  console.log("");
}

// TASK: LAST - Assign mock values to hasAudit, hackHistory, platformAge for each pool to simulate reputation/security data
// TASK: LAST - Create a function to rank pools based on a score combining hasAudit (boolean), hackHistory (number of hacks), and platformAge (months)
// TASK: LAST - Score: hasAudit (50 points if true), hackHistory (-20 points per hack), platformAge (+1 point per month)
// TASK: LAST - Return a sorted array of pools with their scores and ranks
function assignMockSecurityValues(): LiquidityPool[] {
  const mockPools = liquidityPools.map((pool, index) => {
    // Assign realistic mock values based on platform and index
    let hasAudit: boolean;
    let hackHistory: number;
    let platformAge: number;
    
    switch (pool.platform) {
      case "Uniswap":
        hasAudit = true;
        hackHistory = 0; // Uniswap has been very secure
        platformAge = 36; // 3 years
        break;
      case "SushiSwap":
        hasAudit = true;
        hackHistory = 1; // Had one major incident
        platformAge = 24; // 2 years
        break;
      case "Curve":
        hasAudit = true;
        hackHistory = 0; // Curve has been secure
        platformAge = 30; // 2.5 years
        break;
      default:
        hasAudit = false;
        hackHistory = 2;
        platformAge = 12;
    }
    
    return {
      ...pool,
      hasAudit,
      hackHistory,
      platformAge
    };
  });
  
  return mockPools;
}

// TASK: LAST - Function to calculate security score and rank pools
function rankPoolsBySecurity(): RankedPool[] {
  const poolsWithSecurity = assignMockSecurityValues();
  
  const rankedPools: RankedPool[] = poolsWithSecurity.map(pool => {
    // Calculate score: hasAudit (50 points), hackHistory (-20 per hack), platformAge (+1 per month)
    let score = 0;
    
    if (pool.hasAudit) score += 50;
    score -= (pool.hackHistory || 0) * 20;
    score += (pool.platformAge || 0);
    
    return {
      pool,
      score,
      rank: 0, // Will be set after sorting
      securityDetails: {
        hasAudit: pool.hasAudit || false,
        hackHistory: pool.hackHistory || 0,
        platformAge: pool.platformAge || 0
      }
    };
  });
  
  // Sort by score (highest first) and assign ranks
  rankedPools.sort((a, b) => b.score - a.score);
  rankedPools.forEach((rankedPool, index) => {
    rankedPool.rank = index + 1;
  });
  
  return rankedPools;
}

// TASK: LAST - Function to display security rankings
function displaySecurityRankings(): void {
  console.log("=== Security & Reputation Rankings ===\n");
  
  const rankedPools = rankPoolsBySecurity();
  
  console.log("🏆 Pool Rankings (by Security Score):");
  console.log("Score Formula: hasAudit(50) - hacks(20 each) + age(1 per month)\n");
  
  rankedPools.forEach(rankedPool => {
    const { pool, score, rank, securityDetails } = rankedPool;
    const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : "  ";
    
    console.log(`${medal} Rank ${rank}: ${pool.tokenA}/${pool.tokenB} on ${pool.platform}`);
    console.log(`   Score: ${score} points`);
    console.log(`   Security: Audit=${securityDetails.hasAudit ? "✅" : "❌"}, Hacks=${securityDetails.hackHistory}, Age=${securityDetails.platformAge} months`);
    console.log(`   Volume: $${pool.volume.toLocaleString()}`);
    console.log("");
  });
  
  // Show score breakdown for top 3
  console.log("📊 Score Breakdown (Top 3):");
  rankedPools.slice(0, 3).forEach(rankedPool => {
    const { pool, score, rank, securityDetails } = rankedPool;
    const auditPoints = securityDetails.hasAudit ? 50 : 0;
    const hackPenalty = securityDetails.hackHistory * 20;
    const agePoints = securityDetails.platformAge;
    
    console.log(`Rank ${rank} - ${pool.tokenA}/${pool.tokenB} on ${pool.platform}:`);
    console.log(`  Audit: ${auditPoints} points`);
    console.log(`  Hacks: -${hackPenalty} points`);
    console.log(`  Age: +${agePoints} points`);
    console.log(`  Total: ${score} points\n`);
  });
}

// Export for use in other modules
export { 
  LiquidityPool, 
  RatioResult, 
  RankedPool,
  liquidityPools, 
  displayLiquidityPools, 
  getPoolsByPlatform, 
  getPoolsByToken, 
  verifyPoolDistribution,
  calculateRatios,
  displayRatios,
  calculateAverages,
  displayAverages,
  calculateMostCorrectRatio,
  displayMostCorrectRatios,
  pickHighestVolumeRatio,
  displayHighestVolumeRatio,
  assignMockSecurityValues,
  rankPoolsBySecurity,
  displaySecurityRankings
};

// Main execution block
if (require.main === module) {
  displayLiquidityPools();
  verifyPoolDistribution();
  displayRatios();
  displayAverages();
  displayMostCorrectRatios();
  displayHighestVolumeRatio();
  displaySecurityRankings();
  
  // Test to log the ratios
  const ratios = calculateRatios(liquidityPools);
  console.log("Ratios:", ratios.map(r => ({ 
    platform: r.pool.platform, 
    tokenA: r.pool.tokenA, 
    tokenB: r.pool.tokenB, 
    ratio: r.ratio 
  })));
}