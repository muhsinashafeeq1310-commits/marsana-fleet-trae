'use client'

import { Rental } from '@/types'
import { closeRental } from '@/lib/actions'
import type { ActionState } from '@/lib/action-types'
import { useState, useTransition } from 'react'

interface ReturnRentalFormProps {
  rental: Rental
  onSuccess: () => void
  onCancel: () => void
}

export default function ReturnRentalForm({ rental, onSuccess, onCancel }: ReturnRentalFormProps) {
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState<ActionState>({ success: false })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    startTransition(async () => {
      const result = await closeRental(rental.id, formData)
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
        <div>
          <h3 className="text-sm font-medium leading-6 text-gray-900">
            Returning Vehicle: {rental.vehicles?.plate_no}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Contract: {rental.contract_no} | Start Mileage: {rental.start_mileage}
          </p>
        </div>

        <div>
          <label htmlFor="end_mileage" className="block text-sm font-medium leading-6 text-gray-900">
            Return Mileage *
          </label>
          <div className="mt-2">
            <input
              type="number"
              name="end_mileage"
              id="end_mileage"
              required
              min={rental.start_mileage || 0}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <label htmlFor="end_fuel_level" className="block text-sm font-medium leading-6 text-gray-900">
            Return Fuel Level
          </label>
          <div className="mt-2">
            <select
              name="end_fuel_level"
              id="end_fuel_level"
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
          {isPending ? 'Processing...' : 'Complete Return'}
        </button>
      </div>
    </form>
  )
}
