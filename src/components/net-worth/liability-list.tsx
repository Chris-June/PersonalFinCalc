import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import type { Liability } from '@/lib/types';
import { LIABILITY_CATEGORIES } from '@/lib/types';
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
import { LiabilityForm } from './liability-form';

interface LiabilityListProps {
  liabilities: Liability[];
  onUpdate: (id: string, liability: Partial<Liability>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function LiabilityList({
  liabilities,
  onUpdate,
  onDelete,
}: LiabilityListProps) {
  const [editingLiability, setEditingLiability] = useState<Liability | null>(null);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Interest Rate</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {liabilities.map((liability) => (
            <TableRow key={liability.id}>
              <TableCell>{liability.name}</TableCell>
              <TableCell>{LIABILITY_CATEGORIES[liability.category]}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(liability.amount)}
              </TableCell>
              <TableCell className="text-right">
                {liability.interest_rate ? `${liability.interest_rate}%` : '-'}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingLiability(liability)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(liability.id)}
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
        open={!!editingLiability}
        onOpenChange={() => setEditingLiability(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Liability</DialogTitle>
          </DialogHeader>
          {editingLiability && (
            <LiabilityForm
              defaultValues={editingLiability}
              onSubmit={async (values) => {
                await onUpdate(editingLiability.id, values);
                setEditingLiability(null);
              }}
              onCancel={() => setEditingLiability(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}