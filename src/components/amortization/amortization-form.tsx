import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { z } from 'zod';
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

const schema = z.object({
  principal: z.string().min(1, 'Principal is required').transform((val) => parseFloat(val)),
  annualRate: z.string().min(1, 'Interest rate is required').transform((val) => parseFloat(val)),
  termMonths: z.string().min(1, 'Term is required').transform((val) => parseInt(val)),
});

type FormValues = z.input<typeof schema>;

interface AmortizationFormProps {
  onCalculate: (values: z.output<typeof schema>) => void;
  onSave?: (values: z.output<typeof schema>) => void;
}

export function AmortizationForm({ onCalculate, onSave }: AmortizationFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      principal: '',
      annualRate: '',
      termMonths: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onCalculate)} className="space-y-4">
        <FormField
          control={form.control}
          name="principal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Principal Amount</FormLabel>
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
          name="annualRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Annual Interest Rate (%)</FormLabel>
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
          name="termMonths"
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
        <div className="flex gap-2">
          <Button type="submit" className="flex-1">Calculate</Button>
          {onSave && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const values = form.getValues();
                if (form.formState.isValid) {
                  onSave({
                    principal: parseFloat(values.principal),
                    annualRate: parseFloat(values.annualRate),
                    termMonths: parseInt(values.termMonths),
                  });
                }
              }}
            >
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}