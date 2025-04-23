import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClaimsDistribution } from '@/components/dashboard/ClaimsDistribution';
import { fetchBillingStats } from './actions';
import { ArrowDownIcon, ArrowUpIcon } from '../components/ui/icons';

export default async function DashboardPage() {
  const stats = await fetchBillingStats();
  
  // Calculate percentages for trends
  const totalClaims = stats.totalClaims;
  const approvalRate = ((stats.approvedClaims / totalClaims) * 100).toFixed(1);
  const denialRate = ((stats.deniedClaims / totalClaims) * 100).toFixed(1);
  const pendingRate = ((stats.pendingClaims / totalClaims) * 100).toFixed(1);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your healthcare billing metrics and claims distribution
        </p>
      </div>
      
      <div className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalClaims}</div>
              <div className="mt-1">
                <div className="text-sm font-medium">Total Amount</div>
                <div className="text-2xl font-bold text-blue-600">
                  ${stats.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Claims</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingClaims}</div>
              <div className="mt-1">
                <div className="text-sm font-medium">Pending Amount</div>
                <div className="text-2xl font-bold text-yellow-600">
                  ${stats.pendingAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {pendingRate}% of total claims
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Approved Claims</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.approvedClaims}</div>
              <div className="mt-1">
                <div className="text-sm font-medium">Approved Amount</div>
                <div className="text-2xl font-bold text-green-600">
                  ${stats.approvedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <div className="flex items-center text-xs text-green-600 mt-1">
                <ArrowUpIcon className="h-4 w-4 mr-1" />
                {approvalRate}% approval rate
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Denied Claims</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.deniedClaims}</div>
              <div className="mt-1">
                <div className="text-sm font-medium">Denied Amount</div>
                <div className="text-2xl font-bold text-red-600">
                  ${stats.deniedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <div className="flex items-center text-xs text-red-600 mt-1">
                <ArrowDownIcon className="h-4 w-4 mr-1" />
                {denialRate}% denial rate
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <ClaimsDistribution />
        </div>
      </div>
    </div>
  );
}
