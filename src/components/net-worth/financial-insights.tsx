import { Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FinancialInsightsProps {
  insights: string[];
}

export function FinancialInsights({ insights }: FinancialInsightsProps) {
  if (insights.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Financial Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {insights.map((insight, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-sm text-muted-foreground"
            >
              <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-primary" />
              {insight}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}