'use client'

import { Vehicle } from '@/types'
import { createInspection, ActionState } from '@/lib/actions'
import { supabase } from '@/lib/supabase'
import { useState, useTransition } from 'react'

interface InspectionFormProps {
  vehicles: Vehicle[]
  onSuccess: () => void
  onCancel: () => void
}

const CHECKLIST_ITEMS = [
  'Tires OK',
  'Brakes OK',
  'Lights OK',
  'Oil Level OK',
  'Body Condition',
  'Interior Clean'
]

export default function InspectionForm({ vehicles, onSuccess, onCancel }: InspectionFormProps) {
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState<ActionState>({ success: false })
  const [checklist, setChecklist] = useState<Record<string, boolean>>(
    CHECKLIST_ITEMS.reduce((acc, item) => ({ ...acc, [item]: true }), {})
  )
  const [uploading, setUploading] = useState(false)

  const handleChecklistChange = (item: string, checked: boolean) => {
    setChecklist(prev => ({ ...prev, [item]: checked }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    
    formData.set('checklist', JSON.stringify(checklist))

    // Handle File Upload
    const fileInput = event.currentTarget.querySelector('input[type="file"]') as HTMLInputElement
    const files = fileInput?.files
    const photoUrls: string[] = []

    if (files && files.length > 0) {
      setUploading(true)
      try {
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          const fileExt = file.name.split('.').pop()
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
          const filePath = `${fileName}`

          const { data, error } = await supabase.storage
            .from('inspection-photos')
            .upload(filePath, file)

          if (error) {
            console.error('Upload error:', error)
            // Continue or throw? Let's continue but log
            // If bucket doesn't exist or RLS fails, this will error.
            // In dev mode without real storage, this might fail.
          } else if (data) {
            const { data: { publicUrl } } = supabase.storage
              .from('inspection-photos')
              .getPublicUrl(filePath)
            
            photoUrls.push(publicUrl)
          }
        }
      } catch (err) {
        console.error('File upload exception:', err)
      } finally {
        setUploading(false)
      }
    }

    formData.set('photos', JSON.stringify(photoUrls))
    
    startTransition(async () => {
      const result = await createInspection(state, formData)
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

        {/* Mileage */}
        <div>
          <label htmlFor="mileage" className="block text-sm font-medium leading-6 text-gray-900">
            Current Mileage *
          </label>
          <div className="mt-2">
            <input
              type="number"
              name="mileage"
              id="mileage"
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        {/* Result */}
        <div>
          <label htmlFor="result" className="block text-sm font-medium leading-6 text-gray-900">
            Result *
          </label>
          <div className="mt-2">
            <select
              id="result"
              name="result"
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              <option value="CLEAN">CLEAN</option>
              <option value="DAMAGE">DAMAGE</option>
              <option value="SERVICE_DUE">SERVICE DUE</option>
            </select>
          </div>
        </div>

        {/* Checklist */}
        <div>
          <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">
            Checklist
          </label>
          <div className="grid grid-cols-2 gap-4">
            {CHECKLIST_ITEMS.map((item) => (
              <div key={item} className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    id={`check-${item}`}
                    name={`check-${item}`}
                    type="checkbox"
                    checked={checklist[item]}
                    onChange={(e) => handleChecklistChange(item, e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label htmlFor={`check-${item}`} className="font-medium text-gray-900">
                    {item}
                  </label>
                </div>
              </div>
            ))}
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

        {/* Photos */}
        <div>
          <label htmlFor="photos" className="block text-sm font-medium leading-6 text-gray-900">
            Photos
          </label>
          <div className="mt-2">
             <input
              type="file"
              id="photos"
              name="photos"
              multiple
              accept="image/*"
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-x-3 pt-6">
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending || uploading}
          className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending || uploading}
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : isPending ? 'Saving...' : 'Submit Inspection'}
        </button>
      </div>
    </form>
  )
}
