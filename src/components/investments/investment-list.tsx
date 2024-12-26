import { useState } from 'react';
import { format } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import type { Investment } from '@/lib/types';
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
import { InvestmentForm } from './investment-form';

interface InvestmentListProps {
  investments: Investment[];
  onUpdate: (id: string, investment: Partial<Investment>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function InvestmentList({
  investments,
  onUpdate,
  onDelete,
}: InvestmentListProps) {
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(
    null
  );

  if (investments.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">No investments yet</p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Symbol</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Purchase Price</TableHead>
            <TableHead className="text-right">Total Value</TableHead>
            <TableHead>Purchase Date</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {investments.map((investment) => (
            <TableRow key={investment.id}>
              <TableCell>{investment.name}</TableCell>
              <TableCell>{investment.symbol || '-'}</TableCell>
              <TableCell className="text-right">{investment.quantity}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(investment.purchase_price)}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(investment.quantity * investment.purchase_price)}
              </TableCell>
              <TableCell>
                {format(new Date(investment.purchase_date), 'PP')}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingInvestment(investment)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(investment.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog
        open={!!editingInvestment}
        onOpenChange={() => setEditingInvestment(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Investment</DialogTitle>
          </DialogHeader>
          {editingInvestment && (
            <InvestmentForm
              defaultValues={editingInvestment}
              onSubmit={async (values) => {
                await onUpdate(editingInvestment.id, values);
                setEditingInvestment(null);
              }}
              onCancel={() => setEditingInvestment(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}