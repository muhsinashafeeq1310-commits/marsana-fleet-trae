import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Car, AlertTriangle, Wrench, Activity } from 'lucide-react'

interface DashboardStatsProps {
  metrics: {
    totalVehicles: number
    onRentVehicles: number
    maintenanceVehicles: number
    activeAlerts: number
    utilizationRate: number
  }
}

export default function DashboardStats({ metrics }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium">Total Vehicles</h3>
          <Car className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="p-6 pt-0">
          <div className="text-2xl font-bold">{metrics.totalVehicles}</div>
          <p className="text-xs text-muted-foreground">Fleet Size</p>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium">Utilization</h3>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="p-6 pt-0">
          <div className="text-2xl font-bold">{metrics.utilizationRate}%</div>
          <p className="text-xs text-muted-foreground">{metrics.onRentVehicles} On Rent</p>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium">Maintenance</h3>
          <Wrench className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="p-6 pt-0">
          <div className="text-2xl font-bold">{metrics.maintenanceVehicles}</div>
          <p className="text-xs text-muted-foreground">Vehicles in Service</p>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium">Active Alerts</h3>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="p-6 pt-0">
          <div className="text-2xl font-bold">{metrics.activeAlerts}</div>
          <p className="text-xs text-muted-foreground">Requires Attention</p>
        </div>
      </div>
    </div>
  )
}
