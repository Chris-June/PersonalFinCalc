import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { APP_NAME } from '@/lib/constants';
import { useNetWorth } from '@/hooks/use-net-worth';
import { useBudget } from '@/hooks/use-budget';
import { useLoans } from '@/hooks/use-loans';
import { useInvestments } from '@/hooks/use-investments';
import { useDocuments } from '@/hooks/use-documents';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AccountSummary } from '@/components/dashboard/account-summary';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { UpcomingPayments } from '@/components/dashboard/upcoming-payments';
import { InvestmentPerformance } from '@/components/dashboard/investment-performance';
import { RecentDocuments } from '@/components/dashboard/recent-documents';
import { FinancialGoals } from '@/components/dashboard/financial-goals';
import { formatCurrency } from '@/lib/utils';

export function Dashboard() {
  const { totalAssets, totalLiabilities, netWorth } = useNetWorth();
  const { transactions, categories } = useBudget(new Date());
  const { loans } = useLoans();
  const { investments } = useInvestments();
  const { documents } = useDocuments();

  const [selectedMonth] = useState(new Date());
  const totalInvested = investments.reduce(
    (sum, inv) => sum + inv.quantity * inv.purchase_price,
    0
  );
  const totalMonthlyPayments = loans.reduce(
    (sum, loan) => sum + loan.monthly_payment,
    0
  );
  // Example goals - in a real app, these would come from the database
  const goals = [
    {
      name: 'Emergency Fund',
      currentAmount: totalAssets * 0.1, // 10% of assets
      targetAmount: 10000,
      type: 'asset',
    },
    {
      name: 'Debt Reduction',
      currentAmount: totalLiabilities,
      targetAmount: 0,
      type: 'liability',
    },
  ];

  return (
    <>
      <Helmet>
        <title>{APP_NAME} - Dashboard</title>
      </Helmet>
      <div className="container space-y-6 py-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your financial command center
          </p>
        </div>

        <AccountSummary
          totalAssets={totalAssets}
          totalLiabilities={totalLiabilities}
          netWorth={netWorth}
        />

        <QuickActions />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalInvested)}</div>
              <p className="text-sm text-muted-foreground">
                Across {investments.length} investments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Monthly Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalMonthlyPayments)}</div>
              <p className="text-sm text-muted-foreground">
                From {loans.length} active loans
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{transactions.length}</div>
              <p className="text-sm text-muted-foreground">
                Transactions this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{documents.length}</div>
              <p className="text-sm text-muted-foreground">
                Stored documents
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <RecentTransactions
              transactions={transactions}
              categories={categories}
            />
            <RecentDocuments documents={documents} />
          </div>
          <div className="space-y-6">
            <UpcomingPayments loans={loans} />
            <InvestmentPerformance investments={investments} />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <FinancialGoals goals={goals} />
          <Card>
            <CardHeader>
              <CardTitle>Monthly Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Income</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(transactions
                      .filter((t) => {
                        const category = categories.find((c) => c.id === t.category_id);
                        return category?.type === 'income';
                      })
                      .reduce((sum, t) => sum + t.amount, 0)
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expenses</span>
                  <span className="font-medium text-red-600">
                    {formatCurrency(transactions
                      .filter((t) => {
                        const category = categories.find((c) => c.id === t.category_id);
                        return category?.type === 'expense';
                      })
                      .reduce((sum, t) => sum + t.amount, 0)
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Loan Payments</span>
                  <span className="font-medium">
                    {formatCurrency(totalMonthlyPayments)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}