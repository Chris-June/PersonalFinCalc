export type AssetCategory =
  | 'cash'
  | 'real_estate'
  | 'vehicles'
  | 'investments'
  | 'other_assets';

export type LiabilityCategory =
  | 'mortgages'
  | 'loans'
  | 'credit_cards'
  | 'other_debts';

export interface Asset {
  id: string;
  name: string;
  category: AssetCategory;
  amount: number;
}

export interface NetWorthHistory {
  id: string;
  date: string;
  total_assets: number;
  total_liabilities: number;
  net_worth: number;
}

export interface FinancialGoal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  type: 'asset' | 'liability' | 'net_worth';
}

export interface Liability {
  id: string;
  name: string;
  category: LiabilityCategory;
  amount: number;
  interest_rate: number | null;
}

export const ASSET_CATEGORIES: Record<AssetCategory, string> = {
  cash: 'Cash & Bank Accounts',
  real_estate: 'Real Estate',
  vehicles: 'Vehicles',
  investments: 'Investments',
  other_assets: 'Other Assets',
};

export const LIABILITY_CATEGORIES: Record<LiabilityCategory, string> = {
  mortgages: 'Mortgages',
  loans: 'Loans',
  credit_cards: 'Credit Cards',
  other_debts: 'Other Debts',
};

export interface TransactionCategory {
  id: string;
  name: string;
  type: 'income' | 'expense';
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category_id: string;
}

export interface Budget {
  id: string;
  category: string;
  type: 'income' | 'expense';
  amount: number;
  month: string;
}

export interface Investment {
  id: string;
  name: string;
  symbol: string | null;
  quantity: number;
  purchase_price: number;
  purchase_date: string;
}

export interface Loan {
  id: string;
  name: string;
  amount: number;
  interest_rate: number;
  term_months: number;
  monthly_payment: number;
  start_date: string;
}

export interface Document {
  id: string;
  name: string;
  description: string | null;
  category: string;
  file_path: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

export const DOCUMENT_CATEGORIES = {
  will: 'Will & Estate',
  power_of_attorney: 'Power of Attorney',
  investment: 'Investment Statements',
  tax: 'Tax Documents',
  insurance: 'Insurance Policies',
  property: 'Property Documents',
  other: 'Other Documents',
} as const;