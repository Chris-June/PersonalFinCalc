import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { toast } from 'sonner';
import { APP_NAME } from '@/lib/constants';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { PaymentBreakdownChart } from '@/components/amortization/payment-breakdown-chart';
import { PaymentChart } from '@/components/amortization/payment-chart';
import { MilestoneAnalysis } from '@/components/amortization/milestone-analysis';
import { calculateAmortization } from '@/lib/utils';
import { AmortizationForm } from '@/components/amortization/amortization-form';
import { AmortizationSchedule } from '@/components/amortization/amortization-schedule';
import { AmortizationSummary } from '@/components/amortization/amortization-summary';
import { SaveCalculationDialog } from '@/components/calculator/save-calculation-dialog';
import { LoadCalculationDialog } from '@/components/calculator/load-calculation-dialog';

interface AmortizationResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  schedule: Array<{
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
    totalInterest: number;
  }>;
}

export function Amortization() {
  const [result, setResult] = useState<AmortizationResult | null>(null);
  const [values, setValues] = useState<{
    principal: number;
    annualRate: number;
    termMonths: number;
  } | null>(null);
  const { user } = useAuth();

  const handleSave = async (values: {
    principal: number;
    annualRate: number;
    termMonths: number;
  }) => {
    if (!user) return;

    try {
      const result = calculateAmortization(
        values.principal,
        values.annualRate,
        values.termMonths
      );

      const { error } = await supabase.from('loans').insert([{
        profile_id: user.id,
        name: `Loan ${new Date().toLocaleDateString()}`,
        amount: values.principal,
        interest_rate: values.annualRate,
        term_months: values.termMonths,
        monthly_payment: result.monthlyPayment,
        start_date: new Date().toISOString(),
      }]);

      if (error) throw error;
      toast.success('Loan saved successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to save loan');
    }
  };

  const handleCalculate = (inputValues: {
    principal: number;
    annualRate: number;
    termMonths: number;
  }) => {
    setValues(inputValues);
    const result = calculateAmortization(
      inputValues.principal,
      inputValues.annualRate,
      inputValues.termMonths
    );
    setResult(result);
  };

  const handleLoad = (data: {
    input: Record<string, unknown>;
    result?: Record<string, unknown>;
  }) => {
    const inputValues = data.input as {
      principal: number;
      annualRate: number;
      termMonths: number;
    };
    handleCalculate(inputValues);
  };

  return (
    <>
      <Helmet>
        <title>Amortization Calculator - {APP_NAME}</title>
      </Helmet>
      <div className="container space-y-6 py-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Amortization Calculator</h1>
          <p className="text-muted-foreground">
            Calculate detailed payment schedules for your loans and mortgages
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[450px,1fr]">
          <div className="space-y-6">
            <div className="rounded-lg border p-6 shadow-sm">
              <div className="mb-4 flex gap-2">
                <LoadCalculationDialog
                  calculatorType="amortization"
                  onLoad={handleLoad}
                />
                {values && result && (
                  <SaveCalculationDialog
                    calculatorType="amortization"
                    inputData={values}
                    resultData={result}
                  />
                )}
              </div>
              <div className="mb-6">
                <h2 className="text-lg font-semibold">Quick Presets</h2>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleCalculate({
                      principal: 200000,
                      annualRate: 6.5,
                      termMonths: 360,
                    })}
                  >
                    30-Year Mortgage
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleCalculate({
                      principal: 25000,
                      annualRate: 4.5,
                      termMonths: 60,
                    })}
                  >
                    5-Year Auto Loan
                  </Button>
                </div>
              </div>
              <AmortizationForm
                onCalculate={handleCalculate}
                onSave={handleSave}
              />
            </div>
            {result && (
              <div className="space-y-6">
              <AmortizationSummary
                monthlyPayment={result.monthlyPayment}
                totalPayment={result.totalPayment}
                totalInterest={result.totalInterest}
              />
              <Card>
                <CardHeader>
                  <CardTitle>Key Metrics</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Interest-to-Principal Ratio:</span>
                    <span className="font-medium">
                      {((result.totalInterest / values.principal) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Cost per $1000 Borrowed:</span>
                    <span className="font-medium">
                      {formatCurrency((result.totalPayment / values.principal) * 1000)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monthly Payment per $1000 Borrowed:</span>
                    <span className="font-medium">
                      {formatCurrency((result.monthlyPayment / values.principal) * 1000)}
                    </span>
                  </div>
                </CardContent>
              </Card>
              </div>
            )}
          </div>

          {result && (
            <div className="space-y-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Payment Analysis</h2>
                  <p className="text-muted-foreground">
                    Detailed breakdown of your loan payments and milestones
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    const csvContent = [
                      ['Month', 'Payment', 'Principal', 'Interest', 'Balance', 'Total Interest'],
                      ...result.schedule.map(row => [
                        row.month,
                        row.payment,
                        row.principal,
                        row.interest,
                        row.balance,
                        row.totalInterest,
                      ]),
                    ]
                      .map(row => row.join(','))
                      .join('\n');
                    
                    const blob = new Blob([csvContent], { type: 'text/csv' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'amortization-schedule.csv';
                    a.click();
                  }}
                >
                  Export to CSV
                </Button>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <PaymentBreakdownChart
                  principal={values.principal}
                  totalInterest={result.totalInterest}
                />
                <PaymentChart schedule={result.schedule} />
              </div>

              <MilestoneAnalysis
                schedule={result.schedule}
                originalPrincipal={values.principal}
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Amortization Schedule</h2>
                  <div className="text-sm text-muted-foreground">
                    Showing {result.schedule.length} payments
                  </div>
                </div>
                <AmortizationSchedule schedule={result.schedule} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}