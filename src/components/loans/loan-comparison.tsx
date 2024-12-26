import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Loan } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface LoanComparisonProps {
  loans: Loan[];
}

export function LoanComparison({ loans }: LoanComparisonProps) {
  // Sort loans by total cost (amount + interest)
  const sortedLoans = [...loans].sort((a, b) => {
    const totalCostA = a.monthly_payment * a.term_months;
    const totalCostB = b.monthly_payment * b.term_months;
    return totalCostA - totalCostB;
  });

  if (loans.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loan Cost Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedLoans.map((loan) => {
            const totalCost = loan.monthly_payment * loan.term_months;
            const totalInterest = totalCost - loan.amount;
            const interestRatio = (totalInterest / loan.amount) * 100;

            return (
              <div key={loan.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{loan.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {formatCurrency(totalCost)}
                  </span>
                </div>
                <div className="flex h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="bg-primary transition-all"
                    style={{ width: `${100 - interestRatio}%` }}
                  />
                  <div
                    className="bg-destructive transition-all"
                    style={{ width: `${interestRatio}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Principal: {formatCurrency(loan.amount)}</span>
                  <span>Interest: {formatCurrency(totalInterest)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}