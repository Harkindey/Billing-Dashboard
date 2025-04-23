export type PaymentStatus = 'Pending' | 'Approved' | 'Denied';

export interface BillingRecord {
  patient_id: string;
  patient_name: string;
  billing_code: string;
  amount: number;
  insurance_provider: string;
  payment_status: PaymentStatus;
  claim_date: string;
}

export interface SimulationParams {
  pendingProbability: number;
  approvedProbability: number;
  deniedProbability: number;
}

export interface SimulationResult {
  expectedRevenue: number;
  minRevenue: number;
  maxRevenue: number;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
}

export interface BillingStats {
  totalClaims: number;
  totalAmount: number;
  pendingClaims: number;
  pendingAmount: number;
  approvedClaims: number;
  approvedAmount: number;
  deniedClaims: number;
  deniedAmount: number;
} 