'use client'

import { Vehicle, Branch } from '@/types'
import { createHandshake } from '@/lib/actions'
import type { ActionState } from '@/lib/action-types'
import { useState, useTransition } from 'react'

interface HandshakeFormProps {
  vehicles: Vehicle[]
  branches: Branch[]
  onSuccess: () => void
  onCancel: () => void
}

export default function HandshakeForm({ vehicles, branches, onSuccess, onCancel }: HandshakeFormProps) {
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState<ActionState>({ success: false })
  const [selectedVehicleId, setSelectedVehicleId] = useState('')

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    // Manually append the inferred from_branch_id
    if (selectedVehicle?.current_branch_id) {
      formData.append('from_branch_id', selectedVehicle.current_branch_id)
    }

    const toBranchId = formData.get('to_branch_id')
    if (selectedVehicle && selectedVehicle.current_branch_id === toBranchId) {
      setState({ success: false, message: 'Destination branch must be different from current branch' })
      return
    }

    startTransition(async () => {
      const result = await createHandshake(state, formData)
      setState(result)
      if (result.success) {
        onSuccess()
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {state.message && (
        <div className={`p-4 rounded-md ${state.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {state.message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-x-6 gap-y-6">
        {/* Vehicle Selection */}
        <div>
          <label htmlFor="vehicle_id" className="block text-sm font-medium leading-6 text-gray-900">
            Vehicle *
          </label>
          <div className="mt-2">
            <select
              id="vehicle_id"
              name="vehicle_id"
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
            >
              <option value="">Select Vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.plate_no} - {vehicle.make} {vehicle.model}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* From Branch (Read-only) */}
        <div>
          <label className="block text-sm font-medium leading-6 text-gray-900">
            From Branch
          </label>
          <div className="mt-2">
            <input
              type="text"
              disabled
              className="block w-full rounded-md border-0 py-1.5 text-gray-500 bg-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
              value={selectedVehicle?.branches?.name || 'Select a vehicle first'}
            />
            {/* Hidden input to ensure it's available if needed, though we append manually in handleSubmit */}
            <input type="hidden" name="from_branch_id_display" value={selectedVehicle?.current_branch_id || ''} />
          </div>
        </div>

        {/* To Branch */}
        <div>
          <label htmlFor="to_branch_id" className="block text-sm font-medium leading-6 text-gray-900">
            To Branch *
          </label>
          <div className="mt-2">
            <select
              id="to_branch_id"
              name="to_branch_id"
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              <option value="">Select Destination Branch</option>
              {branches.map((branch) => (
                <option
                  key={branch.id}
                  value={branch.id}
                  disabled={selectedVehicle?.current_branch_id === branch.id}
                >
                  {branch.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ETA */}
        <div>
          <label htmlFor="eta" className="block text-sm font-medium leading-6 text-gray-900">
            Estimated Arrival (ETA)
          </label>
          <div className="mt-2">
            <input
              type="datetime-local"
              name="eta"
              id="eta"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium leading-6 text-gray-900">
            Notes
          </label>
          <div className="mt-2">
            <textarea
              id="notes"
              name="notes"
              rows={3}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-x-3 pt-6">
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
        >
          {isPending ? 'Creating...' : 'Create Handshake'}
        </button>
      </div>
    </form>
  )
}
