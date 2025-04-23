'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BillingRecord, PaymentStatus } from '@/types/billing';
import { fetchBillingData } from '@/app/actions';
import { ClaimsTableSkeleton } from './ClaimsTableSkeleton';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

export function ClaimsTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof BillingRecord;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<BillingRecord[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const billingData = await fetchBillingData();
        setData(billingData);
      } catch (error) {
        console.error('Error loading billing data:', error);
        throw new Error('Failed to load billing data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSort = (key: keyof BillingRecord) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return { key, direction: 'asc' };
    });
  };

  const filteredAndSortedData = data
    .filter(record => {
      const matchesSearch = Object.values(record).some(value =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesStatus = statusFilter === 'all' || record.payment_status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (!sortConfig) return 0;
      
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  if (loading) {
    return <ClaimsTableSkeleton />;
  }

  return (
    <ErrorBoundary>
      <div className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Input
            placeholder="Search claims..."
            value={searchTerm}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select
            value={statusFilter}
            onValueChange={(value: string) => setStatusFilter(value as PaymentStatus | 'all')}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Denied">Denied</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort('patient_name')}
                >
                  Patient Name
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort('billing_code')}
                >
                  Billing Code
                </TableHead>
                <TableHead
                  className="cursor-pointer text-right"
                  onClick={() => handleSort('amount')}
                >
                  Amount
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort('insurance_provider')}
                >
                  Insurance Provider
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort('payment_status')}
                >
                  Status
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort('claim_date')}
                >
                  Claim Date
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedData.map((record) => (
                <TableRow key={record.patient_id}>
                  <TableCell>{record.patient_name}</TableCell>
                  <TableCell>{record.billing_code}</TableCell>
                  <TableCell className="text-right">
                    ${record.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>{record.insurance_provider}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        record.payment_status === 'Approved'
                          ? 'bg-green-100 text-green-800'
                          : record.payment_status === 'Denied'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {record.payment_status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(record.claim_date).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </ErrorBoundary>
  );
} 