import { useMemo } from 'react';
import {
  BarChart,
  CartesianGrid,
  ChartBar,
  ChartTooltip,
  ChartXAxis,
  ChartYAxis,
  ResponsiveContainer,
  formatCurrency,
} from '@/components/ui/chart-components';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Transaction, TransactionCategory } from '@/lib/types';

interface SpendingTrendsProps {
  transactions: Transaction[];
  categories: TransactionCategory[];
}

export function SpendingTrends({ transactions, categories }: SpendingTrendsProps) {
  const data = useMemo(() => {
    const expenseCategories = categories.filter((c) => c.type === 'expense');
    return expenseCategories.map((category) => ({
      name: category.name,
      amount: transactions
        .filter((t) => t.category_id === category.id)
        .reduce((sum, t) => sum + t.amount, 0),
    }));
  }, [transactions, categories]);

  if (data.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <ChartXAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <ChartYAxis tickFormatter={formatCurrency} />
              <ChartTooltip
                formatter={(value: number) => formatCurrency(value)}
              />
              <ChartBar
                dataKey="amount"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}