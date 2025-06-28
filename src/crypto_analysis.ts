// TypeScript program for price-oracle to analyze liquidity pools.

// Choose Uniswap as the DEX to showcase volume data, using The Graph API for real-time pool data.
// For now, we'll continue using the mock data's volume field to simulate Uniswap's volume data. 
// In a later step (if needed), we can fetch real data from Uniswap's GraphQL API 
// (https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3).
import axios from 'axios';

// Interface for LiquidityPool with all required properties
interface LiquidityPool {
  tokenA: string;
  tokenB: string;
  reserveA: number;
  reserveB: number;
  volume: number; // 24h trading volume
  platform: string;
  hasAudit: boolean | null; // placeholder for reputation/security ranking
  hackHistory: number | null; // placeholder for reputation/security ranking
  platformAge: number | null; // placeholder for reputation/security ranking (in months)
}

// Interface for RatioResult with pool and ratio (reserveB / reserveA)
interface RatioResult {
  pool: LiquidityPool;
  ratio: number; // reserveB / reserveA
  tokenPair: string; // e.g., "ETH/USDC"
  pricePerTokenA: number; // How much of tokenB for 1 tokenA
}

// Function to calculate reserveB / reserveA for each liquidity pool
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

// Define exactly 9 LiquidityPool objects for 3 cryptocurrencies: ETH, USDT, DAI (3 pools each)
// Use platforms Uniswap, SushiSwap, Curve
// Ensure token pairs only involve ETH, USDT, DAI, or USDC (as a common stablecoin)
// Set hasAudit, hackHistory, platformAge to null as placeholders
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

// Function to display all liquidity pools
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

// Function to verify pool distribution
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

// Function to filter pools by platform
function getPoolsByPlatform(platform: string): LiquidityPool[] {
  return liquidityPools.filter(pool => pool.platform === platform);
}

// Function to filter pools by token
function getPoolsByToken(token: string): LiquidityPool[] {
  // Only count pools where the token is tokenA (primary)
  return liquidityPools.filter(pool => pool.tokenA === token);
}

// Function to display ratio calculations
function displayRatios(): void {
  console.log("=== Ratio Calculations (reserveB / reserveA) ===\n");
  
  const ratios = calculateRatios(liquidityPools);
  
  ratios.forEach((result, index) => {
    console.log(`Pool ${index + 1}: ${result.tokenPair}`);
    console.log(`  Platform: ${result.pool.platform}`);
    console.log(`  Reserves: ${result.pool.reserveA.toLocaleString()} ${result.pool.tokenA} / ${result.pool.reserveB.toLocaleString()} ${result.pool.tokenB}`);
    console.log(`  Ratio (${result.pool.tokenB}/${result.pool.tokenA}): ${result.ratio.toFixed(2)}`);
    console.log(`  Price: 1 ${result.pool.tokenA} = ${result.pricePerTokenA.toFixed(2)} ${result.pool.tokenB}`);
    console.log("");
  });
}

// Calculate 10 different types of averages for the ratios from calculateRatios.
// Include: arithmetic mean, geometric mean, median, weighted mean by volume, harmonic mean, midrange, trimmed mean (10% trim), mode, quadratic mean, and max ratio.
// Return an object with each average type as a key and the calculated value as a number.
function calculateAverages(ratios: RatioResult[]): Record<string, number> {
  const ratioValues = ratios.map(r => r.ratio);
  const sortedRatios = [...ratioValues].sort((a, b) => a - b);
  const n = ratioValues.length;
  
  // 1. Arithmetic Mean
  const arithmeticMean = ratioValues.reduce((sum, ratio) => sum + ratio, 0) / n;
  
  // 2. Geometric Mean
  const geometricMean = Math.pow(ratioValues.reduce((product, ratio) => product * ratio, 1), 1/n);
  
  // 3. Median
  const median = n % 2 === 0 
    ? (sortedRatios[n/2 - 1] + sortedRatios[n/2]) / 2 
    : sortedRatios[Math.floor(n/2)];
  
  // 4. Weighted Mean by Volume
  const totalVolume = ratios.reduce((sum, r) => sum + r.pool.volume, 0);
  const weightedMean = ratios.reduce((sum, r) => sum + (r.ratio * r.pool.volume), 0) / totalVolume;
  
  // 5. Harmonic Mean
  const harmonicMean = n / ratioValues.reduce((sum, ratio) => sum + (1 / ratio), 0);
  
  // 6. Midrange
  const midrange = (Math.min(...ratioValues) + Math.max(...ratioValues)) / 2;
  
  // 7. Trimmed Mean (10% trim)
  const trimCount = Math.floor(n * 0.1);
  const trimmedRatios = sortedRatios.slice(trimCount, n - trimCount);
  const trimmedMean = trimmedRatios.reduce((sum, ratio) => sum + ratio, 0) / trimmedRatios.length;
  
  // 8. Mode (most frequent value)
  const frequencyMap = new Map<number, number>();
  ratioValues.forEach(ratio => {
    const rounded = Math.round(ratio * 100) / 100; // Round to 2 decimal places for grouping
    frequencyMap.set(rounded, (frequencyMap.get(rounded) || 0) + 1);
  });
  let mode = ratioValues[0];
  let maxFreq = 1;
  frequencyMap.forEach((freq, value) => {
    if (freq > maxFreq) {
      maxFreq = freq;
      mode = value;
    }
  });
  
  // 9. Quadratic Mean (Root Mean Square)
  const quadraticMean = Math.sqrt(ratioValues.reduce((sum, ratio) => sum + ratio * ratio, 0) / n);
  
  // 10. Max Ratio
  const maxRatio = Math.max(...ratioValues);
  
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
    maxRatio
  };
}

// Function to display all calculated averages
function displayAverages(): void {
  console.log("=== 10 Types of Averages for Ratios ===\n");
  
  const ratios = calculateRatios(liquidityPools);
  const averages = calculateAverages(ratios);
  
  console.log("1. Arithmetic Mean:", averages.arithmeticMean.toFixed(4));
  console.log("2. Geometric Mean:", averages.geometricMean.toFixed(4));
  console.log("3. Median:", averages.median.toFixed(4));
  console.log("4. Weighted Mean (by Volume):", averages.weightedMean.toFixed(4));
  console.log("5. Harmonic Mean:", averages.harmonicMean.toFixed(4));
  console.log("6. Midrange:", averages.midrange.toFixed(4));
  console.log("7. Trimmed Mean (10% trim):", averages.trimmedMean.toFixed(4));
  console.log("8. Mode:", averages.mode.toFixed(4));
  console.log("9. Quadratic Mean (RMS):", averages.quadraticMean.toFixed(4));
  console.log("10. Max Ratio:", averages.maxRatio.toFixed(4));
  console.log("");
}

// Export for use in other modules
export { 
  LiquidityPool, 
  RatioResult, 
  liquidityPools, 
  displayLiquidityPools, 
  getPoolsByPlatform, 
  getPoolsByToken, 
  verifyPoolDistribution,
  calculateRatios,
  displayRatios,
  calculateAverages,
  displayAverages
};

// Example usage
if (require.main === module) {
  displayLiquidityPools();
  verifyPoolDistribution();
  displayRatios();
  displayAverages();
  
  // Test to log the ratios
  const ratios = calculateRatios(liquidityPools);
  console.log("Ratios:", ratios.map(r => ({ 
    platform: r.pool.platform, 
    tokenA: r.pool.tokenA, 
    tokenB: r.pool.tokenB, 
    ratio: r.ratio 
  })));
}