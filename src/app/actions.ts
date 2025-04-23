'use server';

import { mockBillingData } from '@/data/mockData';
import { BillingRecord, BillingStats } from '@/types/billing';

export async function fetchBillingData(): Promise<BillingRecord[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockBillingData;
}

export async function fetchBillingStats(): Promise<BillingStats> {
  const data = await fetchBillingData();
  
  const stats = data.reduce((acc, claim) => {
    // Update total counts and amounts
    acc.totalClaims++;
    acc.totalAmount += claim.amount;

    // Update status-specific counts and amounts
    switch (claim.payment_status) {
      case 'Pending':
        acc.pendingClaims++;
        acc.pendingAmount += claim.amount;
        break;
      case 'Approved':
        acc.approvedClaims++;
        acc.approvedAmount += claim.amount;
        break;
      case 'Denied':
        acc.deniedClaims++;
        acc.deniedAmount += claim.amount;
        break;
    }

    return acc;
  }, {
    totalClaims: 0,
    totalAmount: 0,
    pendingClaims: 0,
    pendingAmount: 0,
    approvedClaims: 0,
    approvedAmount: 0,
    deniedClaims: 0,
    deniedAmount: 0
  } as BillingStats);

  return stats;
} 