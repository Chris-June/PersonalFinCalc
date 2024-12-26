import { Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import type { Transaction, TransactionCategory } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface TransactionListProps {
  transactions: Transaction[];
  categories: TransactionCategory[];
  onDelete: (id: string) => Promise<void>;
}

export function TransactionList({
  transactions,
  categories,
  onDelete,
}: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">No transactions yet</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => {
          const category = categories.find((c) => c.id === transaction.category_id);
          return (
            <TableRow key={transaction.id}>
              <TableCell>{format(new Date(transaction.date), 'PP')}</TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>{category?.name}</TableCell>
              <TableCell
                className={`text-right ${
                  category?.type === 'income'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {formatCurrency(transaction.amount)}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(transaction.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}