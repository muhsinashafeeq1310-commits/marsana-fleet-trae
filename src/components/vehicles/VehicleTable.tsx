'use client'

import { Vehicle, Branch } from '@/types'
import { StatusChip } from '@/components/common/StatusChip'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { useState, useTransition } from 'react'
import Modal from '@/components/common/Modal'
import ConfirmModal from '@/components/common/ConfirmModal'
import VehicleForm from '@/components/vehicles/VehicleForm'
import { deleteVehicle } from '@/lib/actions'

interface VehicleTableProps {
  vehicles: Vehicle[]
  branches: Branch[]
  drivers?: { id: string, full_name: string }[]
}

export default function VehicleTable({ vehicles, branches, drivers = [] }: VehicleTableProps) {
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [deletingVehicle, setDeletingVehicle] = useState<Vehicle | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleDelete = async () => {
    if (!deletingVehicle) return

    const formData = new FormData()
    formData.append('id', deletingVehicle.id)

    startTransition(async () => {
      const result = await deleteVehicle({ success: false }, formData)
      if (result.success) {
        setDeletingVehicle(null)
      } else {
        alert(result.message) // Simple alert for error, could be toast
      }
    })
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
        <p className="text-gray-500">No vehicles found.</p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plate No
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mileage
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Branch
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Inspection
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">{vehicle.plate_no}</span>
                      <span className="text-xs text-gray-500">{vehicle.make} {vehicle.model}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusChip status={vehicle.current_status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {vehicle.mileage?.toLocaleString()} km
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {vehicle.branches?.name || 'Unassigned'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {/* Placeholder for Last Inspection */}
                    -
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        className="text-gray-400 hover:text-gray-600"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit"
                        onClick={() => setEditingVehicle(vehicle)}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                        onClick={() => setDeletingVehicle(vehicle)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingVehicle}
        onClose={() => setEditingVehicle(null)}
        title="Edit Vehicle"
      >
        <VehicleForm
          branches={branches}
          drivers={drivers}
          vehicle={editingVehicle}
          onSuccess={() => setEditingVehicle(null)}
          onCancel={() => setEditingVehicle(null)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingVehicle}
        onClose={() => setDeletingVehicle(null)}
        onConfirm={handleDelete}
        title="Delete Vehicle"
        message={`Are you sure you want to delete vehicle ${deletingVehicle?.plate_no}? This action can be undone by administrators.`}
        isLoading={isPending}
      />
    </>
  )
}
