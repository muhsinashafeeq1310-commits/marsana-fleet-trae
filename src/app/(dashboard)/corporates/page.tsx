import { getCorporates } from '@/lib/api'
import CorporateFilters from '@/components/corporates/CorporateFilters'
import CorporateTable from '@/components/corporates/CorporateTable'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{
    search?: string
    is_active?: string
  }>
}

export default async function CorporatesPage({ searchParams }: PageProps) {
  const params = await searchParams
  
  const filters = {
    search: params.search,
    is_active: params.is_active ? params.is_active === 'true' : undefined
  }

  // Default to active only if no filter? Or all? Usually All or Active.
  // My filter UI handles 'all' by deleting the param.
  // If param is missing => undefined => API ignores it => returns All.
  // That seems correct for an admin list.

  const corporates = await getCorporates(filters)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Corporate Clients</h1>
        <p className="mt-2 text-gray-600">Manage B2B accounts and MSAs.</p>
      </div>

      <CorporateFilters />
      
      <CorporateTable corporates={corporates} />
    </div>
  )
}
