import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Investment } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface DiversificationAnalysisProps {
  investments: Investment[];
}

export function DiversificationAnalysis({ investments }: DiversificationAnalysisProps) {
  const totalValue = investments.reduce(
    (sum, inv) => sum + inv.quantity * inv.purchase_price,
    0
  );

  // Group investments by type/symbol
  const groupedInvestments = investments.reduce((acc, inv) => {
    const key = inv.symbol || inv.name;
    if (!acc[key]) {
      acc[key] = 0;
    }
    acc[key] += inv.quantity * inv.purchase_price;
    return acc;
  }, {} as Record<string, number>);

  // Calculate concentration metrics
  const sortedAllocations = Object.entries(groupedInvestments)
    .map(([name, value]) => ({
      name,
      value,
      percentage: (value / totalValue) * 100,
    }))
    .sort((a, b) => b.percentage - a.percentage);

  const highConcentration = sortedAllocations.filter((item) => item.percentage > 20);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Diversification Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {highConcentration.length > 0 && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950">
              <h4 className="mb-2 font-semibold text-yellow-800 dark:text-yellow-200">
                High Concentration Warning
              </h4>
              <ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
                {highConcentration.map((item) => (
                  <li key={item.name}>
                    {item.name} represents {item.percentage.toFixed(1)}% of your portfolio (
                    {formatCurrency(item.value)})
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-2">
            {sortedAllocations.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{item.name}</span>
                  <span>{formatCurrency(item.value)}</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}