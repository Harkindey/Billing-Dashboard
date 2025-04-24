import { BillingRecord, SimulationResult } from '@/types/billing';

const ITERATIONS = 2000;
const DISTRIBUTION_POINTS = 20;

interface SimulationParams {
  data: BillingRecord[];
  probabilities: {
    Pending: number;
    Approved: number;
    Denied: number;
  };
}

self.onmessage = (e: MessageEvent<SimulationParams>) => {
  const { data, probabilities } = e.data;
  const results: number[] = [];

  // Run simulation iterations
  for (let i = 0; i < ITERATIONS; i++) {
    let iterationTotal = 0;

    data.forEach((claim: BillingRecord) => {
      const probability = probabilities[claim.payment_status] / 100;
      const isPaid = Math.random() < probability;

      if (isPaid) {
        iterationTotal += claim.amount;
      }
    });

    results.push(iterationTotal);
  }

  // Calculate statistics
  results.sort((a, b) => a - b);
  const expectedRevenue = results.reduce((a, b) => a + b, 0) / ITERATIONS;
  const minRevenue = results[0];
  const maxRevenue = results[results.length - 1];
  
  // Calculate 95% confidence interval
  const lowerIndex = Math.floor(ITERATIONS * 0.025);
  const upperIndex = Math.floor(ITERATIONS * 0.975);
  const confidenceInterval = {
    lower: results[lowerIndex],
    upper: results[upperIndex],
  };

  // Calculate distribution for visualization
  const range = maxRevenue - minRevenue;
  const bucketSize = range / DISTRIBUTION_POINTS;
  const distribution = new Array(DISTRIBUTION_POINTS).fill(0);

  results.forEach(value => {
    const bucketIndex = Math.min(
      Math.floor((value - minRevenue) / bucketSize),
      DISTRIBUTION_POINTS - 1
    );
    distribution[bucketIndex]++;
  });

  const distributionData = distribution.map((count, index) => ({
    revenue: minRevenue + (index * bucketSize),
    count,
  }));

  self.postMessage({
    simulationResult: {
      expectedRevenue,
      minRevenue,
      maxRevenue,
      confidenceInterval,
    },
    distributionData,
  });
}; 