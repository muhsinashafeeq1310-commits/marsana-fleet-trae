'use client'

 
import { Vehicle, Branch } from '@/types'
import { createVehicle, updateVehicle, ActionState } from '@/lib/actions'
import { useState, useTransition } from 'react'

interface VehicleFormProps {
  branches: Branch[]
  drivers?: { id: string, full_name: string }[]
  vehicle?: Vehicle | null
  onSuccess: () => void
  onCancel: () => void
}

export default function VehicleForm({ branches, drivers = [], vehicle, onSuccess, onCancel }: VehicleFormProps) {
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState<ActionState>({ success: false })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    
    // Add ID and Version for update
    if (vehicle) {
      formData.append('id', vehicle.id)
      formData.append('version', vehicle.version.toString())
    }

    startTransition(async () => {
      const action = vehicle ? updateVehicle : createVehicle
      const result = await action(state, formData)
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

      <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
        {/* Plate No */}
        <div>
          <label htmlFor="plate_no" className="block text-sm font-medium leading-6 text-gray-900">
            Plate No *
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="plate_no"
              id="plate_no"
              defaultValue={vehicle?.plate_no}
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          {state.errors?.plate_no && (
            <p className="mt-2 text-sm text-red-600">{state.errors.plate_no[0]}</p>
          )}
        </div>

        {/* VIN */}
        <div>
          <label htmlFor="vin" className="block text-sm font-medium leading-6 text-gray-900">
            VIN
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="vin"
              id="vin"
              maxLength={17}
              defaultValue={vehicle?.vin || ''}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        {/* Make */}
        <div>
          <label htmlFor="make" className="block text-sm font-medium leading-6 text-gray-900">
            Make *
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="make"
              id="make"
              defaultValue={vehicle?.make}
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        {/* Model */}
        <div>
          <label htmlFor="model" className="block text-sm font-medium leading-6 text-gray-900">
            Model *
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="model"
              id="model"
              defaultValue={vehicle?.model}
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        {/* Year */}
        <div>
          <label htmlFor="year" className="block text-sm font-medium leading-6 text-gray-900">
            Year
          </label>
          <div className="mt-2">
            <input
              type="number"
              name="year"
              id="year"
              defaultValue={vehicle?.year || ''}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        {/* Color */}
        <div>
          <label htmlFor="color" className="block text-sm font-medium leading-6 text-gray-900">
            Color
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="color"
              id="color"
              defaultValue={vehicle?.color || ''}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        {/* Mileage */}
        <div>
          <label htmlFor="mileage" className="block text-sm font-medium leading-6 text-gray-900">
            Mileage
          </label>
          <div className="mt-2">
            <input
              type="number"
              name="mileage"
              id="mileage"
              defaultValue={vehicle?.mileage || 0}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        {/* Fuel Type */}
        <div>
          <label htmlFor="fuel_type" className="block text-sm font-medium leading-6 text-gray-900">
            Fuel Type
          </label>
          <div className="mt-2">
            <select
              id="fuel_type"
              name="fuel_type"
              defaultValue={vehicle?.fuel_type || ''}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              <option value="">Select Fuel Type</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
        </div>

        {/* Status */}
        <div>
          <label htmlFor="current_status" className="block text-sm font-medium leading-6 text-gray-900">
            Status *
          </label>
          <div className="mt-2">
            <select
              id="current_status"
              name="current_status"
              defaultValue={vehicle?.current_status || 'AVAILABLE'}
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              <option value="AVAILABLE">Available</option>
              <option value="ON_RENT">On Rent</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="PENDING_INSPECTION">Pending Inspection</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="ACCIDENT">Accident</option>
            </select>
          </div>
        </div>

        {/* Branch */}
        <div>
          <label htmlFor="current_branch_id" className="block text-sm font-medium leading-6 text-gray-900">
            Branch *
          </label>
          <div className="mt-2">
            <select
              id="current_branch_id"
              name="current_branch_id"
              defaultValue={vehicle?.current_branch_id || ''}
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              <option value="">Select Branch</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Assigned Driver */}
        <div>
          <label htmlFor="assigned_driver_id" className="block text-sm font-medium leading-6 text-gray-900">
            Assigned Driver
          </label>
          <div className="mt-2">
            <select
              id="assigned_driver_id"
              name="assigned_driver_id"
              defaultValue={vehicle?.assigned_driver_id || ''}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              <option value="">Unassigned</option>
              {drivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.full_name}
                </option>
              ))}
            </select>
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
          {isPending ? 'Saving...' : (vehicle ? 'Update Vehicle' : 'Create Vehicle')}
        </button>
      </div>
    </form>
  )
}
