import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import type { Asset, Liability, NetWorthHistory } from '@/lib/types';
import { useAuth } from '@/lib/auth';

export function useNetWorth() {
  const { user } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [liabilities, setLiabilities] = useState<Liability[]>([]);
  const [history, setHistory] = useState<NetWorthHistory[]>([]);
  const [loading, setLoading] = useState(true);

  const totalAssets = assets.reduce((sum, asset) => sum + asset.amount, 0);
  const totalLiabilities = liabilities.reduce(
    (sum, liability) => sum + liability.amount,
    0
  );
  const netWorth = totalAssets - totalLiabilities;

  const fetchData = useCallback(async () => {
    if (!user) return;

    try {
      const [assetsResponse, liabilitiesResponse, historyResponse] = await Promise.all([
        supabase
          .from('assets')
          .select('*')
          .eq('profile_id', user.id)
          .order('category'),
        supabase
          .from('liabilities')
          .select('*')
          .eq('profile_id', user.id)
          .order('category'),
        supabase
          .from('net_worth_history')
          .select('*')
          .eq('profile_id', user.id)
          .order('date', { ascending: true })
      ]);

      if (assetsResponse.error) throw assetsResponse.error;
      if (liabilitiesResponse.error) throw liabilitiesResponse.error;
      if (historyResponse.error && historyResponse.error.code !== '42P01') {
        throw historyResponse.error;
      }

      setAssets(assetsResponse.data);
      setLiabilities(liabilitiesResponse.data);
      setHistory(historyResponse.data || []);
    } catch (error) {
      console.error('Error fetching net worth data:', error);
      toast.error('Failed to fetch net worth data');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateHistory = useCallback(async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('net_worth_history')
        .insert([{
          profile_id: user.id,
          total_assets: totalAssets,
          total_liabilities: totalLiabilities,
          net_worth: netWorth,
        }]);

      if (error && error.code !== '42P01') throw error;
    } catch (error) {
      console.error('Error updating history:', error);
    }
  }, [user, totalAssets, totalLiabilities, netWorth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!loading) {
      updateHistory();
    }
  }, [loading, updateHistory]);

  const addAsset = async (asset: Omit<Asset, 'id'>) => {
    if (!user) return;

    try {
      const { error, data } = await supabase
        .from('assets')
        .insert([{ ...asset, profile_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setAssets([...assets, data]);
      toast.success('Asset added successfully');
    } catch (error) {
      toast.error('Failed to add asset');
      console.error(error);
    }
  };

  const addLiability = async (liability: Omit<Liability, 'id'>) => {
    if (!user) return;

    try {
      const { error, data } = await supabase
        .from('liabilities')
        .insert([{ ...liability, profile_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setLiabilities([...liabilities, data]);
      toast.success('Liability added successfully');
    } catch (error) {
      toast.error('Failed to add liability');
      console.error(error);
    }
  };

  const updateAsset = async (id: string, asset: Partial<Asset>) => {
    try {
      const { error, data } = await supabase
        .from('assets')
        .update(asset)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setAssets(assets.map((a) => (a.id === id ? data : a)));
      toast.success('Asset updated successfully');
    } catch (error) {
      toast.error('Failed to update asset');
      console.error(error);
    }
  };

  const updateLiability = async (id: string, liability: Partial<Liability>) => {
    try {
      const { error, data } = await supabase
        .from('liabilities')
        .update(liability)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setLiabilities(liabilities.map((l) => (l.id === id ? data : l)));
      toast.success('Liability updated successfully');
    } catch (error) {
      toast.error('Failed to update liability');
      console.error(error);
    }
  };

  const deleteAsset = async (id: string) => {
    try {
      const { error } = await supabase.from('assets').delete().eq('id', id);
      if (error) throw error;
      setAssets(assets.filter((a) => a.id !== id));
      toast.success('Asset deleted successfully');
    } catch (error) {
      toast.error('Failed to delete asset');
      console.error(error);
    }
  };

  const deleteLiability = async (id: string) => {
    try {
      const { error } = await supabase.from('liabilities').delete().eq('id', id);
      if (error) throw error;
      setLiabilities(liabilities.filter((l) => l.id !== id));
      toast.success('Liability deleted successfully');
    } catch (error) {
      toast.error('Failed to delete liability');
      console.error(error);
    }
  };

  return {
    assets,
    liabilities,
    history,
    loading,
    totalAssets,
    totalLiabilities,
    netWorth,
    addAsset,
    addLiability,
    updateAsset,
    updateLiability,
    deleteAsset,
    deleteLiability,
  };
}