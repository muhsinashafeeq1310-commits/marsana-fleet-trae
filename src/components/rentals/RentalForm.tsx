'use client'

import { Vehicle, Corporate } from '@/types'
import { createRental, ActionState } from '@/lib/actions'
import { useState, useTransition } from 'react'

interface RentalFormProps {
  vehicles: Vehicle[]
  corporates?: Corporate[]
  onSuccess: () => void
  onCancel: () => void
}

export default function RentalForm({ vehicles, corporates = [], onSuccess, onCancel }: RentalFormProps) {
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState<ActionState>({ success: false })
  const [selectedVehicleId, setSelectedVehicleId] = useState('')
  const [rentalType, setRentalType] = useState<'INDIVIDUAL' | 'CORPORATE'>('INDIVIDUAL')

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    
    startTransition(async () => {
      const result = await createRental(state, formData)
      setState(result)
      if (result.success) {
        onSuccess()
      }
    })
  }

  // Filter only AVAILABLE vehicles for new rentals
  const availableVehicles = vehicles.filter(v => v.current_status === 'AVAILABLE')

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {state.message && (
        <div className={`p-4 rounded-md ${state.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {state.message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
        {/* Rental Type Selection */}
        <div className="sm:col-span-2">
          <label className="text-base font-semibold text-gray-900">Rental Type</label>
          <fieldset className="mt-4">
            <legend className="sr-only">Rental Type</legend>
            <div className="flex items-center space-x-10">
              <div className="flex items-center">
                <input
                  id="individual"
                  name="rental_type"
                  type="radio"
                  value="INDIVIDUAL"
                  checked={rentalType === 'INDIVIDUAL'}
                  onChange={() => setRentalType('INDIVIDUAL')}
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
                <label htmlFor="individual" className="ml-3 block text-sm font-medium leading-6 text-gray-900">
                  Individual
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="corporate"
                  name="rental_type"
                  type="radio"
                  value="CORPORATE"
                  checked={rentalType === 'CORPORATE'}
                  onChange={() => setRentalType('CORPORATE')}
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
                <label htmlFor="corporate" className="ml-3 block text-sm font-medium leading-6 text-gray-900">
                  Corporate
                </label>
              </div>
            </div>
          </fieldset>
        </div>

        {/* Vehicle Selection */}
        <div className="sm:col-span-2">
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
              {availableVehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.plate_no} - {vehicle.make} {vehicle.model}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Customer Details */}
        <div className="sm:col-span-2">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Customer Information</h3>
        </div>

        {rentalType === 'CORPORATE' && (
          <div className="sm:col-span-2">
            <label htmlFor="corporate_id" className="block text-sm font-medium leading-6 text-gray-900">
              Corporate Account *
            </label>
            <div className="mt-2">
              <select
                id="corporate_id"
                name="corporate_id"
                required={rentalType === 'CORPORATE'}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="">Select Corporate Account</option>
                {corporates.map((corp) => (
                  <option key={corp.id} value={corp.id}>
                    {corp.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="customer_name" className="block text-sm font-medium leading-6 text-gray-900">
            {rentalType === 'CORPORATE' ? 'Authorized Driver Name *' : 'Customer Name *'}
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="customer_name"
              id="customer_name"
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <label htmlFor="customer_phone" className="block text-sm font-medium leading-6 text-gray-900">
            Phone
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="customer_phone"
              id="customer_phone"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        {/* Rental Details */}
        <div className="sm:col-span-2">
            <h3 className="text-sm font-semibold text-gray-900 mb-2 mt-4">Rental Details</h3>
        </div>

        <div>
          <label htmlFor="start_at" className="block text-sm font-medium leading-6 text-gray-900">
            Start Date/Time *
          </label>
          <div className="mt-2">
            <input
              type="datetime-local"
              name="start_at"
              id="start_at"
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <label htmlFor="end_at" className="block text-sm font-medium leading-6 text-gray-900">
            Expected Return *
          </label>
          <div className="mt-2">
            <input
              type="datetime-local"
              name="end_at"
              id="end_at"
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <label htmlFor="start_mileage" className="block text-sm font-medium leading-6 text-gray-900">
            Start Mileage
          </label>
          <div className="mt-2">
            <input
              type="number"
              name="start_mileage"
              id="start_mileage"
              defaultValue={selectedVehicle?.mileage || 0}
              readOnly // Should verify if this should be editable
              className="block w-full rounded-md border-0 py-1.5 text-gray-500 bg-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <label htmlFor="start_fuel_level" className="block text-sm font-medium leading-6 text-gray-900">
            Start Fuel Level
          </label>
          <div className="mt-2">
            <select
              name="start_fuel_level"
              id="start_fuel_level"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
                <option value="1/1">Full (1/1)</option>
                <option value="3/4">3/4</option>
                <option value="1/2">1/2</option>
                <option value="1/4">1/4</option>
                <option value="Empty">Empty</option>
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
          {isPending ? 'Creating...' : 'Create Rental'}
        </button>
      </div>
    </form>
  )
}
