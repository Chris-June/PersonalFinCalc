import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import { useLoans } from '@/hooks/use-loans';
import { LoanComparison } from '@/components/loans/loan-comparison';
import { PayoffCalculator } from '@/components/loans/payoff-calculator';
import { RefinanceAnalysis } from '@/components/loans/refinance-analysis';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { LoanForm } from '@/components/loans/loan-form';
import { LoanList } from '@/components/loans/loan-list';
import { LoanSummary } from '@/components/loans/loan-summary';
import { SaveCalculationDialog } from '@/components/calculator/save-calculation-dialog';
import { LoadCalculationDialog } from '@/components/calculator/load-calculation-dialog';

export function Loans() {
  const {
    loans,
    loading,
    totalOwed,
    totalMonthlyPayment,
    addLoan,
    updateLoan,
    deleteLoan,
  } = useLoans();
  const [dialogOpen, setDialogOpen] = useState(false);

  if (loading) {
    return (
      <div className="container py-6">
        <div className="h-[400px] animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Loans - {APP_NAME}</title>
      </Helmet>
      <div className="container space-y-6 py-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Loans</h1>
          <p className="text-muted-foreground">
            Track and manage your loans and repayment schedules
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <LoanSummary
            totalOwed={totalOwed}
            totalMonthlyPayment={totalMonthlyPayment}
          />
        </div>

        <LoanComparison loans={loans} />

        <div className="flex gap-2">
          <LoadCalculationDialog
            calculatorType="loan"
            onLoad={({ input }) => {
              const savedLoans = Array.isArray(input) ? input : [input] as Array<Omit<Loan, 'id'>>;
              savedLoans.forEach(addLoan);
            }}
          />
          {loans.length > 0 && (
            <SaveCalculationDialog
              calculatorType="loan"
              inputData={loans}
              resultData={{
                totalOwed,
                totalMonthlyPayment,
              }}
            />
          )}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Loan
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Loan</DialogTitle>
              </DialogHeader>
              <LoanForm
                onSubmit={async (loan) => {
                  await addLoan(loan);
                  setDialogOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Active Loans</h2>
          <LoanList
            loans={loans}
            onUpdate={updateLoan}
            onDelete={deleteLoan}
          />
        </div>

        {loans.length > 0 && (
          <div className="grid gap-6 lg:grid-cols-2">
            <PayoffCalculator loan={loans[0]} />
            <RefinanceAnalysis loan={loans[0]} />
          </div>
        )}
      </div>
    </>
  );
}