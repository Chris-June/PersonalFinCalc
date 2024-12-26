import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';

interface ScheduleRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  totalInterest: number;
}

interface AmortizationScheduleProps {
  schedule: ScheduleRow[];
}

export function AmortizationSchedule({ schedule }: AmortizationScheduleProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Month</TableHead>
            <TableHead className="text-right">Payment</TableHead>
            <TableHead className="text-right">Principal</TableHead>
            <TableHead className="text-right">Interest</TableHead>
            <TableHead className="text-right">Balance</TableHead>
            <TableHead className="text-right">Total Interest</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedule.map((row) => (
            <TableRow key={row.month}>
              <TableCell>{row.month}</TableCell>
              <TableCell className="text-right">{formatCurrency(row.payment)}</TableCell>
              <TableCell className="text-right">{formatCurrency(row.principal)}</TableCell>
              <TableCell className="text-right">{formatCurrency(row.interest)}</TableCell>
              <TableCell className="text-right">{formatCurrency(row.balance)}</TableCell>
              <TableCell className="text-right">{formatCurrency(row.totalInterest)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}