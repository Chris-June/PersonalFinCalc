import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Investment } from '@/lib/types';
import {
  AreaChart,
  CartesianGrid,
  ChartArea,
  ChartTooltip,
  ChartXAxis,
  ChartYAxis,
  ResponsiveContainer,
  formatCurrency,
  formatDateLabel,
  formatDateTick,
} from '@/components/ui/chart-components';

interface InvestmentChartProps {
  investments: Investment[];
}

export function InvestmentChart({ investments }: InvestmentChartProps) {
  const data = useMemo(() => {
    const sortedInvestments = [...investments].sort(
      (a, b) => new Date(a.purchase_date).getTime() - new Date(b.purchase_date).getTime()
    );

    let runningTotal = 0;
    return sortedInvestments.map((investment) => {
      runningTotal += investment.quantity * investment.purchase_price;
      return {
        date: investment.purchase_date,
        value: runningTotal,
      };
    });
  }, [investments]);

  if (investments.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Growth</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <ChartXAxis
                dataKey="date"
                tickFormatter={formatDateTick}
              />
              <ChartYAxis
                tickFormatter={formatCurrency}
              />
              <ChartTooltip
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={formatDateLabel}
              />
              <ChartArea
                dataKey="value"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}