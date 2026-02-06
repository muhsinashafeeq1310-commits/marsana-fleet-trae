'use client'

import { Vehicle } from '@/types'
import { useRouter, useSearchParams } from 'next/navigation'

interface MaintenanceFiltersProps {
  vehicles: Vehicle[]
}

export default function MaintenanceFilters({ vehicles }: MaintenanceFiltersProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const handlePriorityChange = (priority: string) => {
    const params = new URLSearchParams(searchParams)
    if (priority && priority !== 'all') {
      params.set('priority', priority)
    } else {
      params.delete('priority')
    }
    router.replace(`/maintenance?${params.toString()}`)
  }

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams)
    if (status && status !== 'all') {
      params.set('status', status)
    } else {
      params.delete('status')
    }
    router.replace(`/maintenance?${params.toString()}`)
  }

  const handleVehicleChange = (vehicleId: string) => {
    const params = new URLSearchParams(searchParams)
    if (vehicleId && vehicleId !== 'all') {
      params.set('vehicle_id', vehicleId)
    } else {
      params.delete('vehicle_id')
    }
    router.replace(`/maintenance?${params.toString()}`)
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 bg-white rounded-lg shadow-sm mb-6">
      <div className="flex flex-1 flex-col sm:flex-row gap-4">
        {/* Vehicle Filter */}
        <div className="relative">
          <label htmlFor="vehicle" className="sr-only">Vehicle</label>
          <select
            id="vehicle"
            className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
            defaultValue={searchParams.get('vehicle_id')?.toString() || 'all'}
            onChange={(e) => handleVehicleChange(e.target.value)}
          >
            <option value="all">All Vehicles</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.plate_no} - {vehicle.make} {vehicle.model}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div className="relative">
          <label htmlFor="priority" className="sr-only">Priority</label>
          <select
            id="priority"
            className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
            defaultValue={searchParams.get('priority')?.toString() || 'all'}
            onChange={(e) => handlePriorityChange(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="relative">
          <label htmlFor="status" className="sr-only">Status</label>
          <select
            id="status"
            className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
            defaultValue={searchParams.get('status')?.toString() || 'all'}
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>
    </div>
  )
}
