import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Asset, AssetCategory, Liability, NetWorthHistory } from './types';
import { ASSET_CATEGORIES } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function calculateGrowthRate(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / Math.abs(previous)) * 100;
}

export function generateFinancialInsights(
  assets: Asset[],
  liabilities: Liability[],
  history?: NetWorthHistory[] | null
) {
  const insights: string[] = [];
  
  // Asset diversification
  const assetsByCategory = assets.reduce((acc, asset) => {
    acc[asset.category] = (acc[asset.category] || 0) + asset.amount;
    return acc;
  }, {} as Record<string, number>);
  
  const totalAssets = Object.values(assetsByCategory).reduce((a, b) => a + b, 0);
  
  // Check asset diversification
  Object.entries(assetsByCategory).forEach(([category, amount]) => {
    const percentage = (amount / totalAssets) * 100;
    if (percentage > 50) {
      insights.push(
        `${percentage.toFixed(1)}% of your assets are in ${ASSET_CATEGORIES[category as AssetCategory]}. Consider diversifying.`
      );
    }
  });

  // Growth trends
  if (history && history.length >= 2) {
    const latest = history[history.length - 1];
    const previous = history[history.length - 2];
    const growthRate = calculateGrowthRate(latest.net_worth, previous.net_worth);
    
    if (growthRate > 0) {
      insights.push(
        `Your net worth grew by ${growthRate.toFixed(1)}% since last month.`
      );
    } else if (growthRate < 0) {
      insights.push(
        `Your net worth decreased by ${Math.abs(growthRate).toFixed(1)}% since last month.`
      );
    }
  }

  // High-interest liabilities
  liabilities
    .filter((l) => l.interest_rate && l.interest_rate > 10)
    .forEach((l) => {
      insights.push(
        `Consider refinancing ${l.name} with ${l.interest_rate}% interest rate.`
      );
    });

  return insights;
}
export function calculateAmortization(
  principal: number,
  annualRate: number,
  termMonths: number
) {
  const monthlyRate = annualRate / 100 / 12;
  const monthlyPayment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1);

  let balance = principal;
  const schedule = [];

  for (let month = 1; month <= termMonths; month++) {
    const interest = balance * monthlyRate;
    const principal = monthlyPayment - interest;
    balance -= principal;

    schedule.push({
      month,
      payment: monthlyPayment,
      principal,
      interest,
      balance: Math.max(0, balance),
      totalInterest: schedule.reduce((sum, row) => sum + row.interest, 0) + interest,
    });
  }

  return {
    monthlyPayment,
    totalPayment: monthlyPayment * termMonths,
    totalInterest: schedule[schedule.length - 1].totalInterest,
    schedule,
  };
}