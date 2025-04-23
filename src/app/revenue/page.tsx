import { RevenueForecast } from '@/components/revenue/RevenueForecast';

export default function RevenuePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Revenue Forecast</h1>
      <RevenueForecast />
    </div>
  );
} 