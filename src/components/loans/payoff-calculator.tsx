import { useState } from 'react';
import { Calculator } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/utils';
import type { Loan } from '@/lib/types';

interface PayoffCalculatorProps {
  loan: Loan;
}

export function PayoffCalculator({ loan }: PayoffCalculatorProps) {
  const [extraPayment, setExtraPayment] = useState(0);

  // Calculate original payoff details
  const originalTotalCost = loan.monthly_payment * loan.term_months;
  const originalTotalInterest = originalTotalCost - loan.amount;

  // Calculate new payoff details with extra payment
  const newMonthlyPayment = loan.monthly_payment + extraPayment;
  const monthlyInterestRate = loan.interest_rate / 100 / 12;
  const newTermMonths = Math.ceil(
    Math.log(
      newMonthlyPayment /
        (newMonthlyPayment - loan.amount * monthlyInterestRate)
    ) / Math.log(1 + monthlyInterestRate)
  );
  const newTotalCost = newMonthlyPayment * newTermMonths;
  const newTotalInterest = newTotalCost - loan.amount;

  // Calculate savings
  const monthsSaved = loan.term_months - newTermMonths;
  const interestSaved = originalTotalInterest - newTotalInterest;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Early Payoff Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <Label htmlFor="extra-payment">Extra Monthly Payment</Label>
            <Input
              id="extra-payment"
              type="number"
              min="0"
              step="10"
              value={extraPayment}
              onChange={(e) => setExtraPayment(Number(e.target.value))}
              className="mt-1.5"
            />
          </div>

          {extraPayment > 0 && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
              <h4 className="mb-2 font-semibold text-green-800 dark:text-green-200">
                Payoff Summary
              </h4>
              <ul className="space-y-1 text-sm text-green-700 dark:text-green-300">
                <li>
                  New Payoff Time: {Math.floor(newTermMonths / 12)} years{' '}
                  {newTermMonths % 12} months
                </li>
                <li>Time Saved: {monthsSaved} months</li>
                <li>Interest Saved: {formatCurrency(interestSaved)}</li>
                <li>New Total Cost: {formatCurrency(newTotalCost)}</li>
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}