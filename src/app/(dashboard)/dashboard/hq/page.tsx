import { getDashboardMetrics } from '@/lib/api'
import DashboardStats from '@/components/dashboard/DashboardStats'

export const dynamic = 'force-dynamic'

export default async function HQDashboardPage() {
  const metrics = await getDashboardMetrics()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">HQ Dashboard</h1>
        <p className="mt-2 text-gray-600">Overview of fleet operations and performance.</p>
      </div>

      <DashboardStats metrics={metrics} />
      
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h3 className="font-semibold leading-none tracking-tight">Recent Activity</h3>
            <p className="text-sm text-muted-foreground mt-2">
              (Placeholder for activity feed: Rentals, Inspections, etc.)
            </p>
          </div>
        </div>
        <div className="col-span-3 rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h3 className="font-semibold leading-none tracking-tight">Fleet Status</h3>
            <p className="text-sm text-muted-foreground mt-2">
              (Placeholder for status chart)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
