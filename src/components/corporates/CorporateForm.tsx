'use client'

import { Corporate } from '@/types'
import { createCorporate, updateCorporate, ActionState } from '@/lib/actions'
import { useState, useTransition } from 'react'

interface CorporateFormProps {
  corporate?: Corporate | null
  onSuccess: () => void
  onCancel: () => void
}

export default function CorporateForm({ corporate, onSuccess, onCancel }: CorporateFormProps) {
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState<ActionState>({ success: false })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    
    if (corporate) {
      formData.append('id', corporate.id)
    }

    startTransition(async () => {
      const action = corporate ? updateCorporate : createCorporate
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
        <div>
          <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
            Company Name *
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="name"
              id="name"
              defaultValue={corporate?.name}
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <label htmlFor="contact_person" className="block text-sm font-medium leading-6 text-gray-900">
            Contact Person
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="contact_person"
              id="contact_person"
              defaultValue={corporate?.contact_person || ''}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <label htmlFor="contact_email" className="block text-sm font-medium leading-6 text-gray-900">
            Email
          </label>
          <div className="mt-2">
            <input
              type="email"
              name="contact_email"
              id="contact_email"
              defaultValue={corporate?.contact_email || ''}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <label htmlFor="contact_phone" className="block text-sm font-medium leading-6 text-gray-900">
            Phone
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="contact_phone"
              id="contact_phone"
              defaultValue={corporate?.contact_phone || ''}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <label htmlFor="msa_expiry_date" className="block text-sm font-medium leading-6 text-gray-900">
            MSA Expiry Date
          </label>
          <div className="mt-2">
            <input
              type="date"
              name="msa_expiry_date"
              id="msa_expiry_date"
              defaultValue={corporate?.msa_expiry_date || ''}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        {corporate && (
          <div className="sm:col-span-2">
            <div className="relative flex items-start">
              <div className="flex h-6 items-center">
                <input
                  id="is_active"
                  name="is_active"
                  type="checkbox"
                  defaultChecked={corporate.is_active}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
              </div>
              <div className="ml-3 text-sm leading-6">
                <label htmlFor="is_active" className="font-medium text-gray-900">
                  Active Status
                </label>
                <p className="text-gray-500">Uncheck to disable this corporate account.</p>
              </div>
            </div>
          </div>
        )}
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
          {isPending ? 'Saving...' : (corporate ? 'Update Corporate' : 'Create Corporate')}
        </button>
      </div>
    </form>
  )
}
