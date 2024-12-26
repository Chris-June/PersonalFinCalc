import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import { useInvestments } from '@/hooks/use-investments';
import { InvestmentChart } from '@/components/investments/investment-chart';
import { PerformanceMetrics } from '@/components/investments/performance-metrics';
import { PortfolioBreakdown } from '@/components/investments/portfolio-breakdown';
import { DiversificationAnalysis } from '@/components/investments/diversification-analysis';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { InvestmentForm } from '@/components/investments/investment-form';
import { InvestmentList } from '@/components/investments/investment-list';
import { SaveCalculationDialog } from '@/components/calculator/save-calculation-dialog';
import { LoadCalculationDialog } from '@/components/calculator/load-calculation-dialog';

export function Investments() {
  const {
    investments,
    loading,
    totalInvested,
    addInvestment,
    updateInvestment,
    deleteInvestment,
  } = useInvestments();
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
        <title>Investments - {APP_NAME}</title>
      </Helmet>
      <div className="container space-y-6 py-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Investments</h1>
          <p className="text-muted-foreground">
            Track your investment portfolio and monitor performance
          </p>
        </div>

        <PerformanceMetrics investments={investments} />

        <div className="grid gap-6 lg:grid-cols-2">
          <InvestmentChart investments={investments} />
          <PortfolioBreakdown investments={investments} />
        </div>

        <DiversificationAnalysis investments={investments} />

        <div className="flex gap-2">
          <LoadCalculationDialog
            calculatorType="investment"
            onLoad={({ input }) => {
              const savedInvestments = input as Array<Omit<Investment, 'id'>>;
              savedInvestments.forEach(addInvestment);
            }}
          />
          {investments.length > 0 && (
            <SaveCalculationDialog
              calculatorType="investment"
              inputData={investments}
              resultData={{
                totalInvested,
              }}
            />
          )}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Investment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Investment</DialogTitle>
              </DialogHeader>
              <InvestmentForm
                onSubmit={async (investment) => {
                  await addInvestment(investment);
                  setDialogOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Investment Portfolio</h2>
          <InvestmentList
            investments={investments}
            onUpdate={updateInvestment}
            onDelete={deleteInvestment}
          />
        </div>
      </div>
    </>
  );
}