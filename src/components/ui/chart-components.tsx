import { format } from 'date-fns';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// Re-export base components with proper types
export { AreaChart, BarChart, CartesianGrid, ResponsiveContainer };

// Custom styled components
export function ChartArea(props: React.ComponentProps<typeof Area>) {
  return (
    <Area
      strokeWidth={2}
      dot={false}
      {...props}
    />
  );
}

export function ChartBar(props: React.ComponentProps<typeof Bar>) {
  return (
    <Bar
      {...props}
    />
  );
}

export function ChartTooltip({
  formatter,
  labelFormatter,
  ...props
}: React.ComponentProps<typeof Tooltip>) {
  return (
    <Tooltip
      formatter={formatter}
      labelFormatter={labelFormatter}
      contentStyle={{
        backgroundColor: 'hsl(var(--popover))',
        border: '1px solid hsl(var(--border))',
        borderRadius: 'var(--radius)',
        padding: '8px 12px',
      }}
      itemStyle={{
        color: 'hsl(var(--foreground))',
        fontSize: '12px',
        padding: '2px 0',
      }}
      labelStyle={{
        color: 'hsl(var(--foreground))',
        fontWeight: 500,
        marginBottom: '4px',
      }}
      cursor={{ fill: 'hsl(var(--muted))' }}
      {...props}
    />
  );
}

export function ChartXAxis({
  tickFormatter,
  ...props
}: React.ComponentProps<typeof XAxis>) {
  return (
    <XAxis
      axisLine={false}
      tickLine={false}
      tick={{
        fill: 'hsl(var(--muted-foreground))',
        fontSize: 12,
      }}
      tickFormatter={tickFormatter}
      {...props}
    />
  );
}

export function ChartYAxis({
  tickFormatter,
  ...props
}: React.ComponentProps<typeof YAxis>) {
  return (
    <YAxis
      axisLine={false}
      tickLine={false}
      tick={{
        fill: 'hsl(var(--muted-foreground))',
        fontSize: 12,
      }}
      tickFormatter={tickFormatter}
      width={80}
      {...props}
    />
  );
}

// Utility functions for formatting
export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDateTick(date: string) {
  return format(new Date(date), 'MMM yyyy');
}

export function formatDateLabel(date: string) {
  return format(new Date(date), 'MMMM d, yyyy');
}