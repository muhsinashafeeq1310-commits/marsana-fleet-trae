import { getDashboardMetrics } from '@/lib/api'
import DashboardStats from '@/components/dashboard/DashboardStats'

export const dynamic = 'force-dynamic'

export default async function BranchDashboardPage() {
  // In a real app, we'd filter these metrics by the current user's branch
  const metrics = await getDashboardMetrics()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Branch Dashboard</h1>
        <p className="text-sm text-gray-500">View and manage your branch&apos;s vehicles and operations.</p>
      </div>

      <DashboardStats metrics={metrics} />
      
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h3 className="font-semibold leading-none tracking-tight">Today&apos;s Tasks</h3>
            <p className="text-sm text-muted-foreground mt-2">
              (Placeholder for daily tasks: Pickups, Returns, Inspections due)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
