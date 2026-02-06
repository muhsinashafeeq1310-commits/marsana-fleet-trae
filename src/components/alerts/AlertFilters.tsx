'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function AlertFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const handleTypeChange = (type: string) => {
    const params = new URLSearchParams(searchParams)
    if (type && type !== 'all') {
      params.set('type', type)
    } else {
      params.delete('type')
    }
    router.replace(`/alerts?${params.toString()}`)
  }

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams)
    if (status && status !== 'all') {
      params.set('is_resolved', status === 'resolved' ? 'true' : 'false')
    } else {
      params.delete('is_resolved')
    }
    router.replace(`/alerts?${params.toString()}`)
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 bg-white rounded-lg shadow-sm mb-6">
      <div className="flex flex-1 flex-col sm:flex-row gap-4">
        {/* Type Filter */}
        <div className="relative">
          <label htmlFor="type" className="sr-only">Type</label>
          <select
            id="type"
            className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
            defaultValue={searchParams.get('type')?.toString() || 'all'}
            onChange={(e) => handleTypeChange(e.target.value)}
          >
            <option value="all">All Alert Types</option>
            <option value="MAINTENANCE_DUE">Maintenance Due</option>
            <option value="VEHICLE_ACCIDENT">Accident</option>
            <option value="INSPECTION_OVERDUE">Inspection Overdue</option>
            <option value="HANDSHAKE_OVERDUE">Handshake Overdue</option>
            <option value="RENTAL_OVERDUE">Rental Overdue</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="relative">
          <label htmlFor="status" className="sr-only">Status</label>
          <select
            id="status"
            className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
            defaultValue={
                searchParams.has('is_resolved') 
                    ? (searchParams.get('is_resolved') === 'true' ? 'resolved' : 'active') 
                    : 'active'
            }
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            <option value="active">Active</option>
            <option value="resolved">Resolved</option>
            <option value="all">All</option>
          </select>
        </div>
      </div>
    </div>
  )
}
