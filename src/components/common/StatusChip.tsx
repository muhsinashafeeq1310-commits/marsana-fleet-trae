import { VehicleStatus } from '@/types'
import { cn } from '@/lib/utils'

const vehicleStatusStyles: Record<VehicleStatus, string> = {
  AVAILABLE: 'bg-green-100 text-green-700 border-green-200',
  ON_RENT: 'bg-blue-100 text-blue-700 border-blue-200',
  IN_TRANSIT: 'bg-purple-100 text-purple-700 border-purple-200',
  PENDING_INSPECTION: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  MAINTENANCE: 'bg-orange-100 text-orange-700 border-orange-200',
  ACCIDENT: 'bg-red-100 text-red-700 border-red-200',
}

const handshakeStatusStyles: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  ACCEPTED: 'bg-blue-100 text-blue-700 border-blue-200',
  REJECTED: 'bg-red-100 text-red-700 border-red-200',
  IN_TRANSIT: 'bg-purple-100 text-purple-700 border-purple-200',
  COMPLETED: 'bg-green-100 text-green-700 border-green-200',
  CANCELLED: 'bg-gray-100 text-gray-700 border-gray-200',
}

export function StatusChip({ status }: { status: string }) {
  const style = vehicleStatusStyles[status as VehicleStatus] || handshakeStatusStyles[status] || 'bg-gray-100 text-gray-800'
  
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        style
      )}
    >
      {status.replace(/_/g, ' ')}
    </span>
  )
}
