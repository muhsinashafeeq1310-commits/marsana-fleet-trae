import { getDriverAssignments } from '@/lib/api'
import { supabase } from '@/lib/supabase'
import AssignedVehicles from '@/components/driver/AssignedVehicles'

export const dynamic = 'force-dynamic'

export default async function DriverPortalPage() {
  // In a real app with auth, we get the current user ID
  // For now, we'll mock it or fetch the first user who is a driver
  const { data: drivers } = await supabase.from('users').select('id').eq('role', 'driver').limit(1)
  const currentDriverId = drivers?.[0]?.id

  if (!currentDriverId) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-lg font-medium text-gray-900">Access Denied</h3>
        <p className="mt-1 text-sm text-gray-500">No driver account found. Please contact your administrator.</p>
      </div>
    )
  }

  const { vehicles } = await getDriverAssignments(currentDriverId)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Driver Portal</h1>
        <p className="mt-2 text-gray-600">My Assigned Vehicles & Tasks</p>
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mb-4">Assigned Vehicles</h2>
      <AssignedVehicles vehicles={vehicles} />
      
      {/* Future: Add My Tasks (Handshakes) section here */}
    </div>
  )
}
