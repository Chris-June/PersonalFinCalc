import { TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Transaction, TransactionCategory } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface BudgetInsightsProps {
  transactions: Transaction[];
  categories: TransactionCategory[];
  budgets: {
    category: string;
    amount: number;
  }[];
}

export function BudgetInsights({
  transactions,
  categories,
  budgets,
}: BudgetInsightsProps) {
  // Calculate insights
  const insights: Array<{
    type: 'success' | 'warning' | 'danger';
    icon: typeof TrendingUp;
    message: string;
  }> = [];

  // Group transactions by category
  const spendingByCategory = transactions.reduce((acc, transaction) => {
    const category = categories.find((c) => c.id === transaction.category_id);
    if (category?.type === 'expense') {
      acc[category.id] = (acc[category.id] || 0) + transaction.amount;
    }
    return acc;
  }, {} as Record<string, number>);

  // Check budget vs actual spending
  Object.entries(spendingByCategory).forEach(([categoryId, amount]) => {
    const category = categories.find((c) => c.id === categoryId);
    const budget = budgets.find((b) => b.category === categoryId);
    
    if (category && budget) {
      const percentUsed = (amount / budget.amount) * 100;
      
      if (percentUsed >= 90) {
        insights.push({
          type: 'danger',
          icon: AlertTriangle,
          message: `You've used ${percentUsed.toFixed(1)}% of your ${category.name} budget (${formatCurrency(amount)} of ${formatCurrency(budget.amount)})`,
        });
      } else if (percentUsed >= 75) {
        insights.push({
          type: 'warning',
          icon: TrendingUp,
          message: `You've used ${percentUsed.toFixed(1)}% of your ${category.name} budget`,
        });
      }
    }
  });

  // Find categories with no spending
  budgets.forEach((budget) => {
    const category = categories.find((c) => c.id === budget.category);
    if (category && !spendingByCategory[category.id]) {
      insights.push({
        type: 'success',
        icon: TrendingDown,
        message: `No spending in ${category.name} this month - Great job saving!`,
      });
    }
  });

  if (insights.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <div
                key={index}
                className={`flex items-center gap-2 rounded-lg border p-3 text-sm ${
                  insight.type === 'danger'
                    ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400'
                    : insight.type === 'warning'
                    ? 'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-400'
                    : 'border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-400'
                }`}
              >
                <Icon className="h-4 w-4" />
                <p>{insight.message}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}