import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import type { Loan } from '@/lib/types';
import { useAuth } from '@/lib/auth';

export function useLoans() {
  const { user } = useAuth();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('loans')
        .select('*')
        .eq('profile_id', user.id)
        .order('name');

      if (error) throw error;
      setLoans(data);
    } catch (error) {
      toast.error('Failed to fetch loans');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addLoan = async (loan: Omit<Loan, 'id'>) => {
    if (!user) return;

    try {
      const { error, data } = await supabase
        .from('loans')
        .insert([{ ...loan, profile_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setLoans([...loans, data]);
      toast.success('Loan added successfully');
    } catch (error) {
      toast.error('Failed to add loan');
      console.error(error);
    }
  };

  const updateLoan = async (id: string, loan: Partial<Loan>) => {
    try {
      const { error, data } = await supabase
        .from('loans')
        .update(loan)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setLoans(loans.map((l) => (l.id === id ? data : l)));
      toast.success('Loan updated successfully');
    } catch (error) {
      toast.error('Failed to update loan');
      console.error(error);
    }
  };

  const deleteLoan = async (id: string) => {
    try {
      const { error } = await supabase.from('loans').delete().eq('id', id);
      if (error) throw error;
      setLoans(loans.filter((l) => l.id !== id));
      toast.success('Loan deleted successfully');
    } catch (error) {
      toast.error('Failed to delete loan');
      console.error(error);
    }
  };

  const totalOwed = loans.reduce((sum, loan) => sum + loan.amount, 0);
  const totalMonthlyPayment = loans.reduce((sum, loan) => sum + loan.monthly_payment, 0);

  return {
    loans,
    loading,
    totalOwed,
    totalMonthlyPayment,
    addLoan,
    updateLoan,
    deleteLoan,
  };
}