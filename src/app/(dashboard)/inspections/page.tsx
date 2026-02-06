import { getInspections, getVehicles } from '@/lib/api'
import { InspectionResult } from '@/types'
import InspectionFilters from '@/components/inspections/InspectionFilters'
import InspectionTable from '@/components/inspections/InspectionTable'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{
    vehicle_id?: string
    result?: string
  }>
}

export default async function InspectionsPage({ searchParams }: PageProps) {
  const params = await searchParams
  
  const filters = {
    vehicle_id: params.vehicle_id,
    result: params.result as InspectionResult
  }

  const [inspections, vehicles] = await Promise.all([
    getInspections(filters),
    getVehicles() // Fetch all active vehicles for the filter dropdown
  ])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Inspections</h1>
        <p className="mt-2 text-gray-600">View and manage vehicle inspections.</p>
      </div>

      <InspectionFilters vehicles={vehicles} />
      
      <InspectionTable inspections={inspections} />
    </div>
  )
}
