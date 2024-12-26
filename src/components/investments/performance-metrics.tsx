import { ArrowDown, ArrowUp, Percent } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Investment } from '@/lib/types';
import { calculateGrowthRate, formatCurrency } from '@/lib/utils';

interface PerformanceMetricsProps {
  investments: Investment[];
  currentPrices?: Record<string, number>;
}

export function PerformanceMetrics({ investments, currentPrices }: PerformanceMetricsProps) {
  const totalInvested = investments.reduce(
    (sum, inv) => sum + inv.quantity * inv.purchase_price,
    0
  );

  const currentValue = investments.reduce((sum, inv) => {
    const currentPrice = currentPrices?.[inv.symbol || inv.name] || inv.purchase_price;
    return sum + inv.quantity * currentPrice;
  }, 0);

  const totalGain = currentValue - totalInvested;
  const percentageGain = calculateGrowthRate(currentValue, totalInvested);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4">
          <CardTitle className="text-sm font-medium">Current Value</CardTitle>
          <Percent className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(currentValue)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4">
          <CardTitle className="text-sm font-medium">Total Gain/Loss</CardTitle>
          {totalGain >= 0 ? (
            <ArrowUp className="h-4 w-4 text-green-500" />
          ) : (
            <ArrowDown className="h-4 w-4 text-red-500" />
          )}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${
            totalGain >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {formatCurrency(totalGain)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4">
          <CardTitle className="text-sm font-medium">Return Rate</CardTitle>
          {percentageGain >= 0 ? (
            <ArrowUp className="h-4 w-4 text-green-500" />
          ) : (
            <ArrowDown className="h-4 w-4 text-red-500" />
          )}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${
            percentageGain >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {percentageGain.toFixed(2)}%
          </div>
        </CardContent>
      </Card>
    </div>
  );
}