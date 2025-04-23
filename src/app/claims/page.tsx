import { ClaimsTable } from '@/components/claims/ClaimsTable';

export default function ClaimsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Claims Management</h1>
      <ClaimsTable />
    </div>
  );
} 