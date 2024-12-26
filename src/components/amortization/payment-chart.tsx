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
} from '@/components/ui/chart-components';

interface PaymentChartProps {
  schedule: Array<{
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
  }>;
}

export function PaymentChart({ schedule }: PaymentChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={schedule}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <ChartXAxis
                dataKey="month"
                label={{ value: 'Month', position: 'insideBottom', offset: -5 }}
              />
              <ChartYAxis tickFormatter={formatCurrency} />
              <ChartTooltip
                formatter={(value: number) => formatCurrency(value)}
              />
              <ChartArea
                dataKey="balance"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.2}
                name="Remaining Balance"
              />
              <ChartArea
                dataKey="interest"
                stroke="hsl(var(--destructive))"
                fill="hsl(var(--destructive))"
                fillOpacity={0.2}
                name="Interest"
              />
              <ChartArea
                dataKey="principal"
                stroke="hsl(var(--secondary))"
                fill="hsl(var(--secondary))"
                fillOpacity={0.2}
                name="Principal"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}