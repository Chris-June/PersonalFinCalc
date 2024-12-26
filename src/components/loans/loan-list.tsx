import { useState } from 'react';
import { format } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import type { Loan } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { LoanForm } from './loan-form';

interface LoanListProps {
  loans: Loan[];
  onUpdate: (id: string, loan: Partial<Loan>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function LoanList({ loans, onUpdate, onDelete }: LoanListProps) {
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);

  if (loans.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">No loans yet</p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Interest Rate</TableHead>
            <TableHead className="text-right">Term (Months)</TableHead>
            <TableHead className="text-right">Monthly Payment</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loans.map((loan) => (
            <TableRow key={loan.id}>
              <TableCell>{loan.name}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(loan.amount)}
              </TableCell>
              <TableCell className="text-right">
                {loan.interest_rate}%
              </TableCell>
              <TableCell className="text-right">{loan.term_months}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(loan.monthly_payment)}
              </TableCell>
              <TableCell>{format(new Date(loan.start_date), 'PP')}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingLoan(loan)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(loan.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!editingLoan} onOpenChange={() => setEditingLoan(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Loan</DialogTitle>
          </DialogHeader>
          {editingLoan && (
            <LoanForm
              defaultValues={editingLoan}
              onSubmit={async (values) => {
                await onUpdate(editingLoan.id, values);
                setEditingLoan(null);
              }}
              onCancel={() => setEditingLoan(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}