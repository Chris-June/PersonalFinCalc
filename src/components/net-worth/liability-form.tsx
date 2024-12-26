import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Liability, LiabilityCategory } from '@/lib/types';
import { LIABILITY_CATEGORIES } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.enum(['mortgages', 'loans', 'credit_cards', 'other_debts'] as const),
  amount: z.string().min(1, 'Amount is required').transform((val) => parseFloat(val)),
  interest_rate: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : null)),
});

type FormValues = z.input<typeof schema>;

interface LiabilityFormProps {
  onSubmit: (liability: Omit<Liability, 'id'>) => Promise<void>;
  defaultValues?: Partial<Liability>;
  onCancel?: () => void;
}

export function LiabilityForm({
  onSubmit,
  defaultValues,
  onCancel,
}: LiabilityFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      category: defaultValues?.category ?? 'loans',
      amount: defaultValues?.amount?.toString() ?? '',
      interest_rate: defaultValues?.interest_rate?.toString() ?? '',
    },
  });

  const handleSubmit = async (values: FormValues) => {
    await onSubmit({
      name: values.name,
      category: values.category,
      amount: values.amount,
      interest_rate: values.interest_rate,
    });
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Car Loan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(LIABILITY_CATEGORIES).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="interest_rate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interest Rate (%)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">
            {defaultValues ? 'Update Liability' : 'Add Liability'}
          </Button>
        </div>
      </form>
    </Form>
  );
}