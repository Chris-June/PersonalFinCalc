import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import type { Asset } from '@/lib/types';
import { ASSET_CATEGORIES } from '@/lib/types';
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
import { AssetForm } from './asset-form';

interface AssetListProps {
  assets: Asset[];
  onUpdate: (id: string, asset: Partial<Asset>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function AssetList({ assets, onUpdate, onDelete }: AssetListProps) {
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.map((asset) => (
            <TableRow key={asset.id}>
              <TableCell>{asset.name}</TableCell>
              <TableCell>{ASSET_CATEGORIES[asset.category]}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(asset.amount)}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingAsset(asset)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(asset.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!editingAsset} onOpenChange={() => setEditingAsset(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Asset</DialogTitle>
          </DialogHeader>
          {editingAsset && (
            <AssetForm
              defaultValues={editingAsset}
              onSubmit={async (values) => {
                await onUpdate(editingAsset.id, values);
                setEditingAsset(null);
              }}
              onCancel={() => setEditingAsset(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}