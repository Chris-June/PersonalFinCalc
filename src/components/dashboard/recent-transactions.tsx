import { format } from 'date-fns';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Transaction, TransactionCategory } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface RecentTransactionsProps {
  transactions: Transaction[];
  categories: TransactionCategory[];
}

export function RecentTransactions({
  transactions,
  categories,
}: RecentTransactionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.slice(0, 5).map((transaction) => {
            const category = categories.find((c) => c.id === transaction.category_id);
            return (
              <div
                key={transaction.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  {category?.type === 'income' ? (
                    <ArrowUpRight className="h-5 w-5 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-5 w-5 text-red-500" />
                  )}
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(transaction.date), 'PP')}
                    </p>
                  </div>
                </div>
                <div className={`font-medium ${
                  category?.type === 'income'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {category?.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}