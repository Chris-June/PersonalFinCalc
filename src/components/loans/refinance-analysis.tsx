import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/utils';
import type { Loan } from '@/lib/types';

interface RefinanceAnalysisProps {
  loan: Loan;
}

export function RefinanceAnalysis({ loan }: RefinanceAnalysisProps) {
  const [newRate, setNewRate] = useState(loan.interest_rate - 1);
  const [closingCosts, setClosingCosts] = useState(2000);

  // Calculate current loan costs
  const currentMonthlyPayment = loan.monthly_payment;
  const currentTotalCost = currentMonthlyPayment * loan.term_months;
  const currentTotalInterest = currentTotalCost - loan.amount;

  // Calculate new loan costs
  const monthlyInterestRate = newRate / 100 / 12;
  const newMonthlyPayment =
    (loan.amount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loan.term_months)) /
    (Math.pow(1 + monthlyInterestRate, loan.term_months) - 1);
  const newTotalCost = newMonthlyPayment * loan.term_months;
  const newTotalInterest = newTotalCost - loan.amount;

  // Calculate savings and break-even
  const monthlySavings = currentMonthlyPayment - newMonthlyPayment;
  const totalSavings = currentTotalCost - newTotalCost - closingCosts;
  const breakEvenMonths = Math.ceil(closingCosts / monthlySavings);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Refinance Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="new-rate">New Interest Rate (%)</Label>
              <Input
                id="new-rate"
                type="number"
                step="0.125"
                min="0"
                max={loan.interest_rate}
                value={newRate}
                onChange={(e) => setNewRate(Number(e.target.value))}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="closing-costs">Closing Costs</Label>
              <Input
                id="closing-costs"
                type="number"
                step="100"
                min="0"
                value={closingCosts}
                onChange={(e) => setClosingCosts(Number(e.target.value))}
                className="mt-1.5"
              />
            </div>
          </div>

          {newRate < loan.interest_rate && (
            <div className="space-y-4">
              <div className="grid gap-4 rounded-lg border p-4 sm:grid-cols-2">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Current Monthly Payment
                  </div>
                  <div className="mt-1 text-2xl font-bold">
                    {formatCurrency(currentMonthlyPayment)}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    New Monthly Payment
                  </div>
                  <div className="mt-1 text-2xl font-bold">
                    {formatCurrency(newMonthlyPayment)}
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
                <h4 className="mb-2 font-semibold text-green-800 dark:text-green-200">
                  Refinance Summary
                </h4>
                <ul className="space-y-1 text-sm text-green-700 dark:text-green-300">
                  <li>Monthly Savings: {formatCurrency(monthlySavings)}</li>
                  <li>Total Interest Savings: {formatCurrency(currentTotalInterest - newTotalInterest)}</li>
                  <li>Break-even Period: {breakEvenMonths} months</li>
                  <li>Net Savings: {formatCurrency(totalSavings)}</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}