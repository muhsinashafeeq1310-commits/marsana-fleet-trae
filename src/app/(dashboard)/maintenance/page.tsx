import { getMaintenanceTickets, getVehicles } from '@/lib/api'
import { MaintenancePriority } from '@/types'
import MaintenanceFilters from '@/components/maintenance/MaintenanceFilters'
import MaintenanceTable from '@/components/maintenance/MaintenanceTable'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{
    vehicle_id?: string
    priority?: string
    status?: string
  }>
}

export default async function MaintenancePage({ searchParams }: PageProps) {
  const params = await searchParams
  
  const filters = {
    vehicle_id: params.vehicle_id,
    priority: params.priority as MaintenancePriority,
    status: params.status
  }

  const [tickets, vehicles] = await Promise.all([
    getMaintenanceTickets(filters),
    getVehicles()
  ])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Maintenance Tickets</h1>
        <p className="mt-2 text-gray-600">Manage vehicle maintenance and repairs.</p>
      </div>

      <MaintenanceFilters vehicles={vehicles} />
      
      <MaintenanceTable tickets={tickets} />
    </div>
  )
}
