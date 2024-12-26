import { useCallback, useEffect, useState } from 'react';
import { startOfMonth, endOfMonth, format } from 'date-fns';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import type { Budget, Transaction, TransactionCategory } from '@/lib/types';
import { useAuth } from '@/lib/auth';

export function useBudget(selectedMonth: Date) {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<TransactionCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) return;

    try {
      const monthStart = startOfMonth(selectedMonth);
      const monthEnd = endOfMonth(selectedMonth);
      const monthString = format(monthStart, 'yyyy-MM-dd');

      const [budgetsResponse, transactionsResponse, categoriesResponse] = await Promise.all([
        supabase
          .from('budgets')
          .select('*')
          .eq('profile_id', user.id)
          .eq('month', monthString),
        supabase
          .from('transactions')
          .select('*')
          .eq('profile_id', user.id)
          .gte('date', monthStart.toISOString())
          .lte('date', monthEnd.toISOString())
          .order('date', { ascending: false }),
        supabase
          .from('transaction_categories')
          .select('*')
          .eq('profile_id', user.id)
          .order('name'),
      ]);

      if (budgetsResponse.error) throw budgetsResponse.error;
      if (transactionsResponse.error) throw transactionsResponse.error;
      if (categoriesResponse.error) throw categoriesResponse.error;

      setBudgets(budgetsResponse.data);
      setTransactions(transactionsResponse.data);
      setCategories(categoriesResponse.data);
    } catch (error) {
      toast.error('Failed to fetch budget data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [user, selectedMonth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addCategory = async (category: Omit<TransactionCategory, 'id'>) => {
    if (!user) return;

    try {
      const { error, data } = await supabase
        .from('transaction_categories')
        .insert([{ ...category, profile_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setCategories([...categories, data]);
      toast.success('Category added successfully');
      return data;
    } catch (error) {
      toast.error('Failed to add category');
      console.error(error);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    if (!user) return;

    try {
      const { error, data } = await supabase
        .from('transactions')
        .insert([{ ...transaction, profile_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setTransactions([data, ...transactions]);
      toast.success('Transaction added successfully');
    } catch (error) {
      toast.error('Failed to add transaction');
      console.error(error);
    }
  };

  const updateBudget = async (categoryId: string, amount: number) => {
    if (!user) return;

    const monthString = format(startOfMonth(selectedMonth), 'yyyy-MM-dd');
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return;

    try {
      const existing = budgets.find((b) => b.category === categoryId);
      if (existing) {
        const { error, data } = await supabase
          .from('budgets')
          .update({ amount })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        setBudgets(budgets.map((b) => (b.id === data.id ? data : b)));
      } else {
        const { error, data } = await supabase
          .from('budgets')
          .insert([{
            profile_id: user.id,
            category: categoryId,
            type: category.type,
            amount,
            month: monthString,
          }])
          .select()
          .single();

        if (error) throw error;
        setBudgets([...budgets, data]);
      }
      toast.success('Budget updated successfully');
    } catch (error) {
      toast.error('Failed to update budget');
      console.error(error);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const { error } = await supabase.from('transactions').delete().eq('id', id);
      if (error) throw error;
      setTransactions(transactions.filter((t) => t.id !== id));
      toast.success('Transaction deleted successfully');
    } catch (error) {
      toast.error('Failed to delete transaction');
      console.error(error);
    }
  };

  const totalIncome = transactions
    .filter((t) => {
      const category = categories.find((c) => c.id === t.category_id);
      return category?.type === 'income';
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => {
      const category = categories.find((c) => c.id === t.category_id);
      return category?.type === 'expense';
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const netIncome = totalIncome - totalExpenses;

  return {
    budgets,
    transactions,
    categories,
    loading,
    totalIncome,
    totalExpenses,
    netIncome,
    addCategory,
    addTransaction,
    updateBudget,
    deleteTransaction,
  };
}