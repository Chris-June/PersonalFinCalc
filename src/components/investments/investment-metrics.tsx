import { Calculator, TrendingUp, Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Investment } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface InvestmentMetricsProps {
  investments: Investment[];
}

export function InvestmentMetrics({ investments }: InvestmentMetricsProps) {
  const totalInvested = investments.reduce(
    (sum, inv) => sum + inv.quantity * inv.purchase_price,
    0
  );

  const averageInvestment = totalInvested / (investments.length || 1);

  const largestInvestment = investments.reduce((max, inv) => {
    const value = inv.quantity * inv.purchase_price;
    return value > max ? value : max;
  }, 0);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4">
          <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalInvested)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4">
          <CardTitle className="text-sm font-medium">Average Investment</CardTitle>
          <Calculator className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(averageInvestment)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4">
          <CardTitle className="text-sm font-medium">Largest Investment</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(largestInvestment)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}