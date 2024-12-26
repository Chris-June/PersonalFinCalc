import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import type { Investment } from '@/lib/types';
import { useAuth } from '@/lib/auth';

export function useInvestments() {
  const { user } = useAuth();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('profile_id', user.id)
        .order('name');

      if (error) throw error;
      setInvestments(data);
    } catch (error) {
      toast.error('Failed to fetch investments');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addInvestment = async (investment: Omit<Investment, 'id'>) => {
    if (!user) return;

    try {
      const { error, data } = await supabase
        .from('investments')
        .insert([{ ...investment, profile_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setInvestments([...investments, data]);
      toast.success('Investment added successfully');
    } catch (error) {
      toast.error('Failed to add investment');
      console.error(error);
    }
  };

  const updateInvestment = async (id: string, investment: Partial<Investment>) => {
    try {
      const { error, data } = await supabase
        .from('investments')
        .update(investment)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setInvestments(investments.map((i) => (i.id === id ? data : i)));
      toast.success('Investment updated successfully');
    } catch (error) {
      toast.error('Failed to update investment');
      console.error(error);
    }
  };

  const deleteInvestment = async (id: string) => {
    try {
      const { error } = await supabase.from('investments').delete().eq('id', id);
      if (error) throw error;
      setInvestments(investments.filter((i) => i.id !== id));
      toast.success('Investment deleted successfully');
    } catch (error) {
      toast.error('Failed to delete investment');
      console.error(error);
    }
  };

  const totalInvested = investments.reduce(
    (sum, inv) => sum + inv.quantity * inv.purchase_price,
    0
  );

  return {
    investments,
    loading,
    totalInvested,
    addInvestment,
    updateInvestment,
    deleteInvestment,
  };
}