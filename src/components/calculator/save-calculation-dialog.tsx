import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
});

interface SaveCalculationDialogProps {
  calculatorType: 'amortization' | 'investment' | 'loan';
  inputData: Record<string, unknown>;
  resultData?: Record<string, unknown>;
}

export function SaveCalculationDialog({
  calculatorType,
  inputData,
  resultData,
}: SaveCalculationDialogProps) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (values: { name: string }) => {
    if (!user) return;

    try {
      const { error } = await supabase.from('calculator_data').insert([{
        profile_id: user.id,
        calculator_type: calculatorType,
        name: values.name,
        input_data: inputData,
        result_data: resultData,
      }]);

      if (error) throw error;

      toast.success('Calculation saved successfully');
      setOpen(false);
      form.reset();
    } catch (error) {
      toast.error('Failed to save calculation');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Calculation</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Calculation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Save Calculation</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}