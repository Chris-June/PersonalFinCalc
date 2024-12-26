import { useMemo } from 'react';
import type { NetWorthHistory } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

interface NetWorthChartProps {
  history: NetWorthHistory[];
}

export function NetWorthChart({ history }: NetWorthChartProps) {
  const data = useMemo(
    () =>
      history.map((item) => ({
        date: item.date,
        assets: item.total_assets,
        liabilities: -item.total_liabilities,
        netWorth: item.net_worth,
      })),
    [history]
  );

  if (history.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Net Worth History</CardTitle>
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
                dataKey="assets"
                stackId="1"
                stroke="hsl(var(--chart-1))"
                fill="hsl(var(--chart-1))"
                name="Assets"
              />
              <ChartArea
                dataKey="liabilities"
                stackId="1"
                stroke="hsl(var(--chart-2))"
                fill="hsl(var(--chart-2))"
                name="Liabilities"
              />
              <ChartArea
                dataKey="netWorth"
                stroke="hsl(var(--chart-3))"
                fill="none"
                strokeWidth={2}
                name="Net Worth"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}