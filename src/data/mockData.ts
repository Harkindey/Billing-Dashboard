import { BillingRecord } from '@/types/billing';

const insuranceProviders = [
  'Blue Shield',
  'Medicare',
  'Aetna',
  'UnitedHealth',
  'Cigna',
  'Humana',
  'Blue Cross',
  'Kaiser Permanente',
  'Anthem',
  'Molina Healthcare'
];

const patientNames = [
  'John Smith', 'Sarah Johnson', 'Robert Chen', 'Lisa Williams', 'Michael Garcia',
  'Emily Rodriguez', 'David Kim', 'Jennifer Taylor', 'Thomas Anderson', 'Maria Martinez',
  'James Wilson', 'Patricia Brown', 'Joseph Lee', 'Margaret White', 'Charles Davis',
  'Linda Miller', 'Daniel Martin', 'Elizabeth Clark', 'Paul Wright', 'Barbara Jones',
  'Mark Thompson', 'Susan Anderson', 'Kevin Lewis', 'Dorothy Young', 'George Hall'
];

const statuses: Array<'Pending' | 'Approved' | 'Denied'> = ['Pending', 'Approved', 'Denied'];

export const mockBillingData: BillingRecord[] = Array.from({ length: 50 }, (_, index) => {
  const randomDate = new Date();
  randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 90)); // Random date within last 90 days

  return {
    patient_id: `P${index + 1}`,
    patient_name: patientNames[Math.floor(Math.random() * patientNames.length)],
    billing_code: `B${(1000 + index).toString()}`,
    amount: Number((Math.random() * 10000 + 1000).toFixed(2)),
    insurance_provider: insuranceProviders[Math.floor(Math.random() * insuranceProviders.length)],
    payment_status: statuses[Math.floor(Math.random() * statuses.length)],
    claim_date: randomDate.toISOString().split('T')[0]
  };
}); 