'use client'

import { Vehicle } from '@/types'
import { useRouter, useSearchParams } from 'next/navigation'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import Modal from '@/components/common/Modal'
import InspectionForm from './InspectionForm'

interface InspectionFiltersProps {
  vehicles: Vehicle[]
}

export default function InspectionFilters({ vehicles }: InspectionFiltersProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const handleResultChange = (result: string) => {
    const params = new URLSearchParams(searchParams)
    if (result && result !== 'all') {
      params.set('result', result)
    } else {
      params.delete('result')
    }
    router.replace(`/inspections?${params.toString()}`)
  }

  const handleVehicleChange = (vehicleId: string) => {
    const params = new URLSearchParams(searchParams)
    if (vehicleId && vehicleId !== 'all') {
      params.set('vehicle_id', vehicleId)
    } else {
      params.delete('vehicle_id')
    }
    router.replace(`/inspections?${params.toString()}`)
  }

  return (
    <>
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

          {/* Result Filter */}
          <div className="relative">
            <label htmlFor="result" className="sr-only">Result</label>
            <select
              id="result"
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              defaultValue={searchParams.get('result')?.toString() || 'all'}
              onChange={(e) => handleResultChange(e.target.value)}
            >
              <option value="all">All Results</option>
              <option value="CLEAN">Clean</option>
              <option value="DAMAGE">Damage</option>
              <option value="SERVICE_DUE">Service Due</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <Plus className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            New Inspection
          </button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Inspection"
      >
        <InspectionForm
          vehicles={vehicles}
          onSuccess={() => setIsModalOpen(false)}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  )
}
