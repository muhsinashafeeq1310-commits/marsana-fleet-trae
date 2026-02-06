import { getHandshakes, getBranches, getVehicles } from '@/lib/api'
import { HandshakeStatus } from '@/types'
import HandshakeFilters from '@/components/handshakes/HandshakeFilters'
import HandshakeTable from '@/components/handshakes/HandshakeTable'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{
    status?: string
    from_branch?: string
    to_branch?: string
  }>
}

export default async function HandshakesPage({ searchParams }: PageProps) {
  const params = await searchParams
  
  const filters = {
    status: params.status as HandshakeStatus,
    from_branch_id: params.from_branch,
    to_branch_id: params.to_branch
  }

  const [handshakes, branches, availableVehicles] = await Promise.all([
    getHandshakes(filters),
    getBranches(),
    getVehicles({ status: 'AVAILABLE' })
  ])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Handshakes (Transfers)</h1>
        <p className="mt-2 text-gray-600">Manage vehicle transfers between branches.</p>
      </div>

      <HandshakeFilters branches={branches} vehicles={availableVehicles} />
      
      <HandshakeTable handshakes={handshakes} />
    </div>
  )
}
