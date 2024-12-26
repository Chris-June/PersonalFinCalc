import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

interface MilestoneAnalysisProps {
  schedule: Array<{
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
    totalInterest: number;
  }>;
  originalPrincipal: number;
}

export function MilestoneAnalysis({
  schedule,
  originalPrincipal,
}: MilestoneAnalysisProps) {
  // Find key milestones
  const halfwayPoint = schedule.find(
    (row) => row.balance <= originalPrincipal / 2
  );
  const quarterPoint = schedule.find(
    (row) => row.balance <= originalPrincipal / 4
  );
  const interestEqualsPoint = schedule.find(
    (row) => row.totalInterest >= originalPrincipal
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loan Milestones</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {halfwayPoint && (
            <div className="rounded-lg border p-4">
              <h4 className="font-medium">Halfway Point</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                You'll reach 50% paid off in {halfwayPoint.month} months (
                {(halfwayPoint.month / 12).toFixed(1)} years)
              </p>
            </div>
          )}

          {quarterPoint && (
            <div className="rounded-lg border p-4">
              <h4 className="font-medium">75% Complete</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                You'll have 75% paid off in {quarterPoint.month} months (
                {(quarterPoint.month / 12).toFixed(1)} years)
              </p>
            </div>
          )}

          {interestEqualsPoint && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
              <h4 className="font-medium text-destructive">Interest Warning</h4>
              <p className="mt-1 text-sm text-destructive/80">
                Total interest paid will equal the principal amount (
                {formatCurrency(originalPrincipal)}) after{' '}
                {interestEqualsPoint.month} months (
                {(interestEqualsPoint.month / 12).toFixed(1)} years)
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}