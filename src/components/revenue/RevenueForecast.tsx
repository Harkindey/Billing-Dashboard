'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BillingRecord, SimulationResult } from '@/types/billing';
import { fetchBillingData } from '@/app/actions';
import { RevenueForecastSkeleton } from './RevenueForecastSkeleton';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { Skeleton } from '@/components/ui/skeleton';

const ITERATIONS = 2000;
const DISTRIBUTION_POINTS = 20;

export function RevenueForecast() {
  const [loading, setLoading] = useState(true);
  const [simulationLoading, setSimulationLoading] = useState(false);
  const [data, setData] = useState<BillingRecord[]>([]);
  const [probabilities, setProbabilities] = useState({
    Pending: 70,
    Approved: 100,
    Denied: 30,
  });

  const [simulationResult, setSimulationResult] = useState<SimulationResult>({
    expectedRevenue: 0,
    minRevenue: 0,
    maxRevenue: 0,
    confidenceInterval: {
      lower: 0,
      upper: 0,
    },
  });

  const [distributionData, setDistributionData] = useState<{ revenue: number; count: number }[]>([]);

  // WE CAN USE WEBWORKER HERE, i did use them but they were failing on production. and i ran out of time to fix them.

  // const workerRef = useRef<Worker | null>(null);

  // useEffect(() => {
  //   // Initialize the worker
  //   workerRef.current = new Worker(new URL('@/workers/revenueSimulation.worker.ts', import.meta.url));

  //   // Set up the message handler
  //   workerRef.current.onmessage = (e: MessageEvent) => {
  //     const { simulationResult, distributionData } = e.data;
  //     setSimulationResult(simulationResult);
  //     setDistributionData(distributionData);
  //     setSimulationLoading(false);
  //   };

  //   return () => {
  //     workerRef.current?.terminate();
  //   };
  // }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const billingData = await fetchBillingData();
        setData(billingData);
      } catch (error) {
        console.error('Error loading billing data:', error);
        throw new Error('Failed to load billing data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const runMonteCarloSimulation = useCallback(() => { 
    // if (data.length === 0 || !workerRef.current) return; 
    // workerRef.current.postMessage({ data, probabilities });

    if (data.length === 0) return;

    setSimulationLoading(true);
    
    // Run simulation
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

    const newDistributionData = distribution.map((count, index) => ({
      revenue: minRevenue + (index * bucketSize),
      count,
    }));

    setSimulationResult({
      expectedRevenue,
      minRevenue,
      maxRevenue,
      confidenceInterval,
    });
    setDistributionData(newDistributionData);
    setSimulationLoading(false);
  }, [probabilities, data]);

  useEffect(() => {
    if (!loading) {
      const timeoutId = setTimeout(() => {
        runMonteCarloSimulation();
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [probabilities, runMonteCarloSimulation, loading]);

  const handleProbabilityChange = (status: keyof typeof probabilities, value: number[]) => {
    setProbabilities(prev => ({
      ...prev,
      [status]: value[0],
    }));
  };

  if (loading) {
    return <RevenueForecastSkeleton />;
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Probabilities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Pending Claims</label>
                <span className="text-sm text-muted-foreground">{probabilities.Pending}%</span>
              </div>
              <Slider
                value={[probabilities.Pending]}
                onValueChange={(value) => handleProbabilityChange('Pending', value)}
                max={100}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Approved Claims</label>
                <span className="text-sm text-muted-foreground">{probabilities.Approved}%</span>
              </div>
              <Slider
                value={[probabilities.Approved]}
                onValueChange={(value) => handleProbabilityChange('Approved', value)}
                max={100}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Denied Claims</label>
                <span className="text-sm text-muted-foreground">{probabilities.Denied}%</span>
              </div>
              <Slider
                value={[probabilities.Denied]}
                onValueChange={(value) => handleProbabilityChange('Denied', value)}
                max={100}
                step={1}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Expected Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              {simulationLoading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <div className="text-2xl font-bold">
                  ${simulationResult.expectedRevenue.toFixed(2)}
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Minimum Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              {simulationLoading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <div className="text-2xl font-bold">
                  ${simulationResult.minRevenue.toFixed(2)}
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Maximum Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              {simulationLoading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <div className="text-2xl font-bold">
                  ${simulationResult.maxRevenue.toFixed(2)}
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">95% Confidence Interval</CardTitle>
            </CardHeader>
            <CardContent>
              {simulationLoading ? (
                <Skeleton className="h-5 w-48" />
              ) : (
                <div className="text-sm">
                  ${simulationResult.confidenceInterval.lower.toFixed(2)} - ${simulationResult.confidenceInterval.upper.toFixed(2)}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={distributionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="revenue"
                    tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      value,
                      name === 'count' ? 'Occurrences' : name
                    ]}
                    labelFormatter={(label: number) => `Revenue: $${label.toFixed(2)}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
} 