import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Loan } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface UpcomingPaymentsProps {
  loans: Loan[];
}

export function UpcomingPayments({ loans }: UpcomingPaymentsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Loan Payments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loans.map((loan) => (
            <div
              key={loan.id}
              className="flex items-center justify-between"
            >
              <div>
                <p className="font-medium">{loan.name}</p>
                <p className="text-sm text-muted-foreground">
                  Due {format(new Date(loan.start_date), 'PP')}
                </p>
              </div>
              <div className="text-lg font-semibold">
                {formatCurrency(loan.monthly_payment)}
              </div>
            </div>
          ))}
          {loans.length === 0 && (
            <p className="text-center text-muted-foreground">
              No upcoming payments
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}