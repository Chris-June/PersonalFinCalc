import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import { useBudget } from '@/hooks/use-budget';
import { SaveCalculationDialog } from '@/components/calculator/save-calculation-dialog';
import { LoadCalculationDialog } from '@/components/calculator/load-calculation-dialog';
import { BudgetSummary } from '@/components/budget/budget-summary';
import { BudgetInsights } from '@/components/budget/budget-insights';
import { SpendingTrends } from '@/components/budget/spending-trends';
import { CategoryForm } from '@/components/budget/category-form';
import { TransactionForm } from '@/components/budget/transaction-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { TransactionList } from '@/components/budget/transaction-list';

export function Budget() {
  const [selectedMonth] = useState(new Date());
  const {
    transactions,
    categories,
    budgets,
    loading,
    totalIncome,
    totalExpenses,
    netIncome,
    addCategory,
    addTransaction,
    deleteTransaction,
  } = useBudget(selectedMonth);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);

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
        <title>Budget - {APP_NAME}</title>
      </Helmet>
      <div className="container space-y-6 py-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Budget</h1>
          <p className="text-muted-foreground">
            Track your income and expenses for {format(selectedMonth, 'MMMM yyyy')}
          </p>
        </div>

        <BudgetSummary
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          netIncome={netIncome}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <SpendingTrends
            transactions={transactions}
            categories={categories}
          />
          <BudgetInsights
            transactions={transactions}
            categories={categories}
            budgets={budgets.map((budget) => ({
              category: budget.category,
              amount: budget.amount,
            }))}
          />
        </div>

        <div className="flex gap-2">
          <LoadCalculationDialog
            calculatorType="budget"
            onLoad={(data) => {
              const { transactions: savedTransactions, categories: savedCategories } = data.input as {
                transactions: Array<Omit<Transaction, 'id'>>;
                categories: Array<Omit<TransactionCategory, 'id'>>;
              };
              savedCategories.forEach(addCategory);
              savedTransactions.forEach(addTransaction);
            }}
          />
          {(transactions.length > 0 || categories.length > 0) && (
            <SaveCalculationDialog
              calculatorType="budget"
              inputData={{
                transactions,
                categories,
                budgets,
              }}
              resultData={{
                totalIncome,
                totalExpenses,
                netIncome,
              }}
            />
          )}
          <Dialog open={transactionDialogOpen} onOpenChange={setTransactionDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Transaction</DialogTitle>
              </DialogHeader>
              {categories.length === 0 ? (
                <div className="text-center">
                  <p className="mb-4 text-muted-foreground">
                    Please add some categories first
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Add Category</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Category</DialogTitle>
                      </DialogHeader>
                      <CategoryForm
                        onSubmit={async (category) => {
                          await addCategory(category);
                          setCategoryDialogOpen(false);
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              ) : (
                <TransactionForm
                  categories={categories}
                  onSubmit={async (transaction) => {
                    await addTransaction(transaction);
                    setTransactionDialogOpen(false);
                  }}
                />
              )}
            </DialogContent>
          </Dialog>

          <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Category</DialogTitle>
              </DialogHeader>
              <CategoryForm
                onSubmit={async (category) => {
                  await addCategory(category);
                  setCategoryDialogOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Transactions</h2>
          <TransactionList
            transactions={transactions}
            categories={categories}
            onDelete={deleteTransaction}
          />
        </div>
      </div>
    </>
  );
}