import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

interface CalculatorData {
  id: string;
  name: string;
  input_data: Record<string, unknown>;
  result_data?: Record<string, unknown>;
  created_at: string;
}

interface LoadCalculationDialogProps {
  calculatorType: 'amortization' | 'investment' | 'loan';
  onLoad: (data: { input: Record<string, unknown>; result?: Record<string, unknown> }) => void;
}

export function LoadCalculationDialog({
  calculatorType,
  onLoad,
}: LoadCalculationDialogProps) {
  const [open, setOpen] = useState(false);
  const [calculations, setCalculations] = useState<CalculatorData[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (open && user) {
      const fetchCalculations = async () => {
        try {
          const { data, error } = await supabase
            .from('calculator_data')
            .select('*')
            .eq('profile_id', user.id)
            .eq('calculator_type', calculatorType)
            .order('created_at', { ascending: false });

          if (error) throw error;
          setCalculations(data);
        } catch (error) {
          toast.error('Failed to load saved calculations');
          console.error(error);
        }
      };

      fetchCalculations();
    }
  }, [open, user, calculatorType]);

  const handleLoad = (calculation: CalculatorData) => {
    onLoad({
      input: calculation.input_data,
      result: calculation.result_data,
    });
    setOpen(false);
    toast.success('Calculation loaded successfully');
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('calculator_data')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCalculations(calculations.filter((calc) => calc.id !== id));
      toast.success('Calculation deleted successfully');
    } catch (error) {
      toast.error('Failed to delete calculation');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FolderOpen className="mr-2 h-4 w-4" />
          Import
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Load Saved Calculation</DialogTitle>
        </DialogHeader>
        {calculations.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground">
            No saved calculations found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calculations.map((calculation) => (
                <TableRow key={calculation.id}>
                  <TableCell>{calculation.name}</TableCell>
                  <TableCell>
                    {format(new Date(calculation.created_at), 'PPp')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLoad(calculation)}
                      >
                        Load
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(calculation.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
}