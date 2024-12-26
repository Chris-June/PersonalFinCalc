import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';

const items = [
  { href: ROUTES.dashboard, label: 'Dashboard' },
  { href: ROUTES.netWorth, label: 'Net Worth' },
  { href: ROUTES.budget, label: 'Budget' },
  { href: ROUTES.investments, label: 'Investments' },
  { href: ROUTES.loans, label: 'Loans' },
  { href: ROUTES.amortization, label: 'Amortization' },
  { href: ROUTES.documents, label: 'Documents' },
];

export function MainNav() {
  const location = useLocation();

  return (
    <nav className="flex items-center space-x-6">
      {items.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            location.pathname === item.href
              ? 'text-foreground'
              : 'text-muted-foreground'
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}