'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { BillingRecord } from '@/types/billing';
import { fetchBillingData } from '@/app/actions';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { Skeleton } from '@/components/ui/skeleton';

const COLORS = {
  Pending: '#fbbf24',  // Yellow
  Approved: '#22c55e', // Green
  Denied: '#ef4444',   // Red
};

interface TooltipData {
  name: string;
  value: number;
  amount: number;
  percent: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: TooltipData;
  }>;
}

// Custom tooltip component
const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 shadow-lg rounded-lg border">
        <p className="font-medium text-sm">{data.name}</p>
        <p className="text-sm text-gray-600">Count: {data.value}</p>
        <p className="text-sm text-gray-600">Amount: ${data.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p className="text-sm text-gray-600">Percentage: {(data.percent * 100).toFixed(1)}%</p>
      </div>
    );
  }
  return null;
};

function ClaimsDistributionSkeleton() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Claims Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center">
          <Skeleton className="h-[200px] w-[200px] rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export function ClaimsDistribution() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<BillingRecord[]>([]);

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

  if (loading) {
    return <ClaimsDistributionSkeleton />;
  }

  const distribution = data.reduce((acc, claim) => {
    if (!acc[claim.payment_status]) {
      acc[claim.payment_status] = {
        count: 0,
        amount: 0
      };
    }
    acc[claim.payment_status].count += 1;
    acc[claim.payment_status].amount += claim.amount;
    return acc;
  }, {} as Record<string, { count: number; amount: number }>);

  const total = Object.values(distribution).reduce((sum, { count }) => sum + count, 0);

  const chartData = Object.entries(distribution).map(([name, { count, amount }]) => ({
    name,
    value: count,
    amount,
    percent: count / total
  }));

  return (
    <ErrorBoundary>
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Claims Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[entry.name as keyof typeof COLORS]} 
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
} 