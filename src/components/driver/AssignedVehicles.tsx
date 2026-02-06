import { Vehicle } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Car, MapPin, Calendar, Gauge } from 'lucide-react'

interface AssignedVehiclesProps {
  vehicles: Vehicle[]
}

export default function AssignedVehicles({ vehicles }: AssignedVehiclesProps) {
  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
        <Car className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No vehicles assigned</h3>
        <p className="mt-1 text-sm text-gray-500">You don&apos;t have any vehicles assigned to you at the moment.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {vehicles.map((vehicle) => (
        <Card key={vehicle.id} className="overflow-hidden">
          <CardHeader className="bg-gray-50 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold">{vehicle.plate_no}</CardTitle>
              <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                vehicle.current_status === 'AVAILABLE' ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-gray-50 text-gray-600 ring-gray-500/10'
              }`}>
                {vehicle.current_status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{vehicle.make} {vehicle.model} ({vehicle.year})</p>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <Gauge className="mr-2 h-4 w-4 text-gray-400" />
              {vehicle.mileage?.toLocaleString()} km
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="mr-2 h-4 w-4 text-gray-400" />
              Branch: {vehicle.current_branch_id} 
              {/* Note: We need to join branch name here if possible, but API for this specific call might need adjustment */}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="mr-2 h-4 w-4 text-gray-400" />
              Next Service: {vehicle.next_service_due || 'Not scheduled'}
            </div>
            
            <div className="pt-4 flex gap-2">
              <button className="flex-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
                Inspect
              </button>
              <button className="flex-1 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                Details
              </button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
