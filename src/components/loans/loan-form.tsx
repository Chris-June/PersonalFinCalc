import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { z } from 'zod';
import type { Loan } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  amount: z.string().min(1, 'Amount is required').transform((val) => parseFloat(val)),
  interest_rate: z.string().min(1, 'Interest rate is required').transform((val) => parseFloat(val)),
  term_months: z.string().min(1, 'Term is required').transform((val) => parseInt(val)),
  monthly_payment: z.string().min(1, 'Monthly payment is required').transform((val) => parseFloat(val)),
  start_date: z.date(),
});

type FormValues = z.input<typeof schema>;

interface LoanFormProps {
  onSubmit: (loan: Omit<Loan, 'id'>) => Promise<void>;
  defaultValues?: Partial<Loan>;
  onCancel?: () => void;
}

export function LoanForm({ onSubmit, defaultValues, onCancel }: LoanFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      amount: defaultValues?.amount?.toString() ?? '',
      interest_rate: defaultValues?.interest_rate?.toString() ?? '',
      term_months: defaultValues?.term_months?.toString() ?? '',
      monthly_payment: defaultValues?.monthly_payment?.toString() ?? '',
      start_date: defaultValues?.start_date ? new Date(defaultValues.start_date) : new Date(),
    },
  });

  const handleSubmit = async (values: FormValues) => {
    await onSubmit({
      name: values.name,
      amount: values.amount,
      interest_rate: values.interest_rate,
      term_months: values.term_months,
      monthly_payment: values.monthly_payment,
      start_date: format(values.start_date, 'yyyy-MM-dd'),
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
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loan Amount</FormLabel>
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
        <FormField
          control={form.control}
          name="term_months"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Term (Months)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  placeholder="0"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="monthly_payment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monthly Payment</FormLabel>
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
          name="start_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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
            {defaultValues ? 'Update Loan' : 'Add Loan'}
          </Button>
        </div>
      </form>
    </Form>
  );
}