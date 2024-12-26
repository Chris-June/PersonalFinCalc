import { TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Investment } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface InvestmentPerformanceProps {
  investments: Investment[];
}

export function InvestmentPerformance({ investments }: InvestmentPerformanceProps) {
  const totalInvested = investments.reduce(
    (sum, inv) => sum + inv.quantity * inv.purchase_price,
    0
  );

  const topInvestments = [...investments]
    .sort((a, b) => (b.quantity * b.purchase_price) - (a.quantity * a.purchase_price))
    .slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Investment Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="text-2xl font-bold">
            {formatCurrency(totalInvested)}
          </div>
          <p className="text-sm text-muted-foreground">Total Invested</p>
        </div>
        {topInvestments.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Top Holdings</h4>
            {topInvestments.map((investment) => {
              const value = investment.quantity * investment.purchase_price;
              const percentage = (value / totalInvested) * 100;
              return (
                <div
                  key={investment.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{investment.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {investment.quantity} shares
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(value)}</p>
                    <p className="text-sm text-muted-foreground">
                      {percentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}