'use client'

import { Inspection } from '@/types'
import { format } from 'date-fns'

interface InspectionTableProps {
  inspections: Inspection[]
}

export default function InspectionTable({ inspections }: InspectionTableProps) {
  const getResultColor = (result: string) => {
    switch (result) {
      case 'CLEAN':
        return 'bg-green-50 text-green-700 ring-green-600/20'
      case 'DAMAGE':
        return 'bg-red-50 text-red-700 ring-red-600/20'
      case 'SERVICE_DUE':
        return 'bg-yellow-50 text-yellow-800 ring-yellow-600/20'
      default:
        return 'bg-gray-50 text-gray-600 ring-gray-500/10'
    }
  }

  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    Vehicle
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Type
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Mileage
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Result
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Performed By
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Date
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {inspections.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-4 text-center text-sm text-gray-500">
                      No inspections found.
                    </td>
                  </tr>
                ) : (
                  inspections.map((inspection) => (
                    <tr key={inspection.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {inspection.vehicles?.plate_no}
                        <div className="text-gray-500 font-normal">
                          {inspection.vehicles?.make} {inspection.vehicles?.model}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {inspection.inspection_type}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {inspection.mileage.toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getResultColor(inspection.result)}`}>
                          {inspection.result.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {inspection.performer?.full_name || 'Unknown'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {format(new Date(inspection.performed_at), 'MMM d, yyyy HH:mm')}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button className="text-indigo-600 hover:text-indigo-900">
                          View<span className="sr-only">, {inspection.vehicles?.plate_no}</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
