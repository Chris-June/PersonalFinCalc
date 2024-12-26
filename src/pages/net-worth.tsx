import { Helmet } from 'react-helmet-async';
import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import { ASSET_CATEGORIES, LIABILITY_CATEGORIES } from '@/lib/types';
import { useNetWorth } from '@/hooks/use-net-worth';
import { SaveCalculationDialog } from '@/components/calculator/save-calculation-dialog';
import { LoadCalculationDialog } from '@/components/calculator/load-calculation-dialog';
import { generateFinancialInsights } from '@/lib/utils';
import { AssetList } from '@/components/net-worth/asset-list';
import { LiabilityList } from '@/components/net-worth/liability-list';
import { NetWorthChart } from '@/components/net-worth/net-worth-chart';
import { FinancialInsights } from '@/components/net-worth/financial-insights';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AssetForm } from '@/components/net-worth/asset-form';
import { CategoryBreakdown } from '@/components/net-worth/category-breakdown';
import { LiabilityForm } from '@/components/net-worth/liability-form';
import { NetWorthSummary } from '@/components/net-worth/net-worth-summary';

export function NetWorth() {
  const {
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
  } = useNetWorth();
  const [assetDialogOpen, setAssetDialogOpen] = useState(false);
  const [liabilityDialogOpen, setLiabilityDialogOpen] = useState(false);

  const insights = generateFinancialInsights(assets, liabilities, history);

  const assetsByCategory = useMemo(
    () =>
      Object.entries(ASSET_CATEGORIES).map(([category, label]) => ({
        category: label,
        amount: assets
          .filter((asset) => asset.category === category)
          .reduce((sum, asset) => sum + asset.amount, 0),
      })),
    [assets]
  );

  const liabilitiesByCategory = useMemo(
    () =>
      Object.entries(LIABILITY_CATEGORIES).map(([category, label]) => ({
        category: label,
        amount: liabilities
          .filter((liability) => liability.category === category)
          .reduce((sum, liability) => sum + liability.amount, 0),
      })),
    [liabilities]
  );

  if (loading) {
    return (
      <div className="container py-6">
        <div className="h-[400px] animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Net Worth - {APP_NAME}</title>
      </Helmet>
      <div className="container space-y-6 py-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Net Worth</h1>
          <p className="text-muted-foreground">
            Track your assets and liabilities to calculate your net worth
          </p>
        </div>

        <NetWorthSummary
          totalAssets={totalAssets}
          totalLiabilities={totalLiabilities}
          netWorth={netWorth}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <NetWorthChart history={history} />
          <FinancialInsights insights={insights} />
        </div>

        <div className="flex gap-2">
          <LoadCalculationDialog
            calculatorType="net-worth"
            onLoad={(data) => {
              const { assets: savedAssets, liabilities: savedLiabilities } = data.input as {
                assets: Array<Omit<Asset, 'id'>>;
                liabilities: Array<Omit<Liability, 'id'>>;
              };
              savedAssets.forEach(addAsset);
              savedLiabilities.forEach(addLiability);
            }}
          />
          {(assets.length > 0 || liabilities.length > 0) && (
            <SaveCalculationDialog
              calculatorType="net-worth"
              inputData={{
                assets,
                liabilities,
              }}
              resultData={{
                totalAssets,
                totalLiabilities,
                netWorth,
              }}
            />
          )}
          <Dialog open={assetDialogOpen} onOpenChange={setAssetDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Asset
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Asset</DialogTitle>
              </DialogHeader>
              <AssetForm
                onSubmit={async (asset) => {
                  await addAsset(asset);
                  setAssetDialogOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={liabilityDialogOpen} onOpenChange={setLiabilityDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Liability
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Liability</DialogTitle>
              </DialogHeader>
              <LiabilityForm
                onSubmit={async (liability) => {
                  await addLiability(liability);
                  setLiabilityDialogOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Assets</h2>
            <AssetList
              assets={assets}
              onUpdate={updateAsset}
              onDelete={deleteAsset}
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Liabilities</h2>
            <LiabilityList
              liabilities={liabilities}
              onUpdate={updateLiability}
              onDelete={deleteLiability}
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <CategoryBreakdown data={assetsByCategory} title="Assets Breakdown" />
          <CategoryBreakdown
            data={liabilitiesByCategory}
            title="Liabilities Breakdown"
          />
        </div>
      </div>
    </>
  );
}