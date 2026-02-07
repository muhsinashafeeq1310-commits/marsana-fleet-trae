import { getRentals, getVehicles, getCorporates } from '@/lib/api'
import RentalFilters from '@/components/rentals/RentalFilters'
import RentalTable from '@/components/rentals/RentalTable'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{
    status?: string
    search?: string
  }>
}

export default async function RentalsPage({ searchParams }: PageProps) {
  const params = await searchParams
  
  const filters = {
    status: params.status,
    search: params.search
  }

  const [rentals, vehicles, corporates] = await Promise.all([
    getRentals(filters),
    getVehicles(),
    getCorporates({ is_active: true })
  ])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Rentals</h1>
        <p className="mt-2 text-gray-600">Manage vehicle rental agreements.</p>
      </div>

      <RentalFilters vehicles={vehicles} corporates={corporates} />
      
      <RentalTable rentals={rentals} />
    </div>
  )
}
