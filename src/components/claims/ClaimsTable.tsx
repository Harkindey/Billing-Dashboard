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
import { ArrowUpIcon, ArrowDownIcon, ArrowUpDownIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import { Pagination } from '@/components/ui/pagination';

// Add this new component for the sortable header
function SortableTableHeader({
  children,
  sorted,
  direction,
  onClick,
  className,
}: {
  children: React.ReactNode;
  sorted: boolean;
  direction: 'asc' | 'desc' | null;
  onClick: () => void;
  className?: string;
}) {
  return (
    <TableHead
      className={cn(
        "cursor-pointer select-none",
        sorted && "text-foreground",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-1 justify-inherit">
        <span>{children}</span>
        <span className="w-4 h-4 inline-flex items-center justify-center flex-shrink-0">
          {sorted ? (
            direction === 'asc' ? (
              <ArrowUpIcon className="h-3 w-3" />
            ) : (
              <ArrowDownIcon className="h-3 w-3" />
            )
          ) : (
            <ArrowUpDownIcon className="h-3 w-3 opacity-0 group-hover:opacity-50" />
          )}
        </span>
      </div>
    </TableHead>
  );
}

export function ClaimsTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof BillingRecord;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<BillingRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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

  const filteredData = data.filter(record => {
    const matchesSearch = Object.values(record).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = statusFilter === 'all' || record.payment_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newSize: string) => {
    setPageSize(Number(newSize));
    setCurrentPage(1); // Reset to first page when changing page size
  };

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
              <TableRow className="group">
                <SortableTableHeader
                  sorted={sortConfig?.key === 'patient_name'}
                  direction={sortConfig?.key === 'patient_name' ? sortConfig.direction : null}
                  onClick={() => handleSort('patient_name')}
                >
                  Patient Name
                </SortableTableHeader>
                <SortableTableHeader
                  sorted={sortConfig?.key === 'billing_code'}
                  direction={sortConfig?.key === 'billing_code' ? sortConfig.direction : null}
                  onClick={() => handleSort('billing_code')}
                >
                  Billing Code
                </SortableTableHeader>
                <SortableTableHeader
                  sorted={sortConfig?.key === 'amount'}
                  direction={sortConfig?.key === 'amount' ? sortConfig.direction : null}
                  onClick={() => handleSort('amount')}
                  className="text-right"
                >
                  Amount
                </SortableTableHeader>
                <SortableTableHeader
                  sorted={sortConfig?.key === 'insurance_provider'}
                  direction={sortConfig?.key === 'insurance_provider' ? sortConfig.direction : null}
                  onClick={() => handleSort('insurance_provider')}
                >
                  Insurance Provider
                </SortableTableHeader>
                <SortableTableHeader
                  sorted={sortConfig?.key === 'payment_status'}
                  direction={sortConfig?.key === 'payment_status' ? sortConfig.direction : null}
                  onClick={() => handleSort('payment_status')}
                >
                  Status
                </SortableTableHeader>
                <SortableTableHeader
                  sorted={sortConfig?.key === 'claim_date'}
                  direction={sortConfig?.key === 'claim_date' ? sortConfig.direction : null}
                  onClick={() => handleSort('claim_date')}
                >
                  Claim Date
                </SortableTableHeader>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((record) => (
                <TableRow key={record.patient_id}>
                  <TableCell>{record.patient_name}</TableCell>
                  <TableCell>{record.billing_code}</TableCell>
                  <TableCell>
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

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          className="py-4"
        />
      </div>
    </ErrorBoundary>
  );
} 