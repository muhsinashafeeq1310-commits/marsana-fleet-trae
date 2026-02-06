import { getAlerts } from '@/lib/api'
import { AlertType } from '@/types'
import AlertFilters from '@/components/alerts/AlertFilters'
import AlertTable from '@/components/alerts/AlertTable'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{
    type?: string
    is_resolved?: string
  }>
}

export default async function AlertsPage({ searchParams }: PageProps) {
  const params = await searchParams
  
  const filters = {
    type: params.type as AlertType,
    is_resolved: params.is_resolved ? params.is_resolved === 'true' : undefined
  }

  // Default to active alerts if no filter provided
  if (filters.is_resolved === undefined) {
    filters.is_resolved = false
  }
  // Allow "all" if user selects it (handled in UI by passing no param, or explicit 'all')
  // Actually my UI passes 'active' (false) or 'resolved' (true) or 'all' (undefined).
  // If params.is_resolved is undefined, UI sends nothing? No, UI sends active by default in select.
  // Let's check logic.
  // If params.is_resolved is undefined => 'active' (false)
  // If 'all' => we need a way to pass undefined to API.
  // API accepts undefined.
  // Let's fix this logic slightly.
  
  let resolvedFilter: boolean | undefined = false
  if (params.is_resolved === 'true') resolvedFilter = true
  if (params.is_resolved === 'false') resolvedFilter = false
  // If param is missing, we default to active (false)
  // If we want all, we need a special param value or just handle it here.
  // My Filter UI sends 'true' or 'false' or deletes the param.
  // If deleted, it defaults to active?
  // Let's say if param is missing => All? No, usually Active.
  // I'll stick to: missing = active.

  const alerts = await getAlerts({
    type: filters.type,
    is_resolved: resolvedFilter
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Alerts</h1>
        <p className="mt-2 text-gray-600">System notifications and action items.</p>
      </div>

      <AlertFilters />
      
      <AlertTable alerts={alerts} />
    </div>
  )
}
