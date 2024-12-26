import { Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';
import { APP_NAME } from '@/lib/constants';
import { NavigationMenu } from '../ui/navigation-menu';
import { MainNav } from './main-nav';
import { ThemeToggle } from './theme-toggle';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Calculator className="h-6 w-6" />
          <span className="font-bold">{APP_NAME}</span>
        </Link>
        <NavigationMenu className="mx-6">
          <MainNav />
        </NavigationMenu>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}