'use client'

 
import { Branch } from '@/types'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Plus } from 'lucide-react'
import { useDebouncedCallback } from 'use-debounce'
import { useState } from 'react'
import Modal from '@/components/common/Modal'
import VehicleForm from '@/components/vehicles/VehicleForm'

interface VehicleFiltersProps {
  branches: Branch[]
  drivers?: { id: string, full_name: string }[]
}

export default function VehicleFilters({ branches, drivers = [] }: VehicleFiltersProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('search', term)
    } else {
      params.delete('search')
    }
    router.replace(`/vehicles?${params.toString()}`)
  }, 300)

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams)
    if (status && status !== 'all') {
      params.set('status', status)
    } else {
      params.delete('status')
    }
    router.replace(`/vehicles?${params.toString()}`)
  }

  const handleBranchChange = (branchId: string) => {
    const params = new URLSearchParams(searchParams)
    if (branchId && branchId !== 'all') {
      params.set('branch', branchId)
    } else {
      params.delete('branch')
    }
    router.replace(`/vehicles?${params.toString()}`)
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 bg-white rounded-lg shadow-sm mb-6">
        <div className="flex flex-1 flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by Plate No..."
              className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              defaultValue={searchParams.get('search')?.toString()}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              defaultValue={searchParams.get('status')?.toString() || 'all'}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="AVAILABLE">Available</option>
              <option value="ON_RENT">On Rent</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="PENDING_INSPECTION">Pending Inspection</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="ACCIDENT">Accident</option>
            </select>
          </div>

          {/* Branch Filter */}
          <div className="relative">
            <select
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              defaultValue={searchParams.get('branch')?.toString() || 'all'}
              onChange={(e) => handleBranchChange(e.target.value)}
            >
              <option value="all">All Branches</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <Plus className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            Add Vehicle
          </button>
        </div>
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Vehicle"
      >
        <VehicleForm
          branches={branches}
          drivers={drivers}
          onSuccess={() => setIsAddModalOpen(false)}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>
    </>
  )
}
