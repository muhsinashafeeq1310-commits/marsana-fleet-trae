import { getVehicles, getBranches, getUsers } from '@/lib/api'
import { VehicleStatus } from '@/types'
import VehicleFilters from '@/components/vehicles/VehicleFilters'
import VehicleTable from '@/components/vehicles/VehicleTable'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{
    search?: string
    status?: string
    branch?: string
  }>
}

export default async function VehiclesPage({ searchParams }: PageProps) {
  // Await searchParams first (Next.js 15 requirement)
  const params = await searchParams
  
  const filters = {
    plate_no: params.search,
    status: params.status as VehicleStatus,
    branch_id: params.branch
  }

  // Fetch data in parallel
  const [vehicles, branches, drivers] = await Promise.all([
    getVehicles(filters),
    getBranches(),
    getUsers('driver')
  ])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Vehicles Management</h1>
        <p className="mt-2 text-gray-600">Manage fleet inventory, status, and assignments.</p>
      </div>

      <VehicleFilters branches={branches} drivers={drivers} />
      
      <VehicleTable vehicles={vehicles} branches={branches} drivers={drivers} />
    </div>
  )
}
