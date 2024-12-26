import { Link } from 'react-router-dom';
import {
  Calculator,
  FileText,
  PiggyBank,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES } from '@/lib/constants';

const actions = [
  {
    icon: Calculator,
    label: 'Calculate Loan',
    description: 'Plan your loan payments',
    route: ROUTES.amortization,
    color: 'text-blue-500',
  },
  {
    icon: PiggyBank,
    label: 'Track Budget',
    description: 'Manage your spending',
    route: ROUTES.budget,
    color: 'text-green-500',
  },
  {
    icon: TrendingUp,
    label: 'Investments',
    description: 'Monitor your portfolio',
    route: ROUTES.investments,
    color: 'text-purple-500',
  },
  {
    icon: FileText,
    label: 'Documents',
    description: 'Store important files',
    route: ROUTES.documents,
    color: 'text-orange-500',
  },
  {
    icon: Wallet,
    label: 'Net Worth',
    description: 'Track your wealth',
    route: ROUTES.netWorth,
    color: 'text-indigo-500',
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.route} to={action.route}>
                <Button
                  variant="outline"
                  className="h-auto w-full flex-col gap-2 p-6"
                >
                  <Icon className={`h-6 w-6 ${action.color}`} />
                  <div className="space-y-1 text-center">
                    <h3 className="font-semibold">{action.label}</h3>
                    <p className="text-xs text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </Button>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}