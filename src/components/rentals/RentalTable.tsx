'use client'

import { Rental } from '@/types'
import { format } from 'date-fns'
import { useState } from 'react'
import Modal from '@/components/common/Modal'
import ReturnRentalForm from './ReturnRentalForm'

interface RentalTableProps {
  rentals: Rental[]
}

export default function RentalTable({ rentals }: RentalTableProps) {
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-50 text-green-700 ring-green-600/20'
      case 'COMPLETED':
        return 'bg-blue-50 text-blue-700 ring-blue-600/20'
      case 'OVERDUE':
        return 'bg-red-50 text-red-700 ring-red-600/20'
      case 'CANCELLED':
        return 'bg-gray-50 text-gray-600 ring-gray-500/10'
      default:
        return 'bg-gray-50 text-gray-600 ring-gray-500/10'
    }
  }

  const isOverdue = (rental: Rental) => {
    return rental.status === 'ACTIVE' && new Date(rental.end_at) < new Date()
  }

  return (
    <>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Contract
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Customer
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Vehicle
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Dates
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {rentals.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-4 text-center text-sm text-gray-500">
                        No rentals found.
                      </td>
                    </tr>
                  ) : (
                    rentals.map((rental) => (
                      <tr key={rental.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {rental.contract_no}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="font-medium text-gray-900">{rental.customer_name}</div>
                          <div className="text-xs text-gray-400">{rental.customer_phone}</div>
                          {rental.corporates && (
                            <div className="text-xs text-indigo-600 mt-0.5">
                                {rental.corporates.name}
                            </div>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {rental.vehicles?.plate_no || 'Unknown'}
                          <div className="text-xs text-gray-400">
                              {rental.vehicles?.make} {rental.vehicles?.model}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                            isOverdue(rental) ? 'bg-red-50 text-red-700 ring-red-600/20' : getStatusColor(rental.status)
                          }`}>
                            {isOverdue(rental) ? 'OVERDUE' : rental.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div><span className="text-xs text-gray-400">Start:</span> {format(new Date(rental.start_at), 'MMM d, yyyy')}</div>
                          <div className={isOverdue(rental) ? 'text-red-600 font-medium' : ''}>
                            <span className="text-xs text-gray-400">End:</span> {format(new Date(rental.end_at), 'MMM d, yyyy')}
                          </div>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          {rental.status === 'ACTIVE' && (
                              <button 
                                onClick={() => setSelectedRental(rental)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                Return<span className="sr-only">, {rental.contract_no}</span>
                              </button>
                          )}
                          {rental.status !== 'ACTIVE' && (
                              <button className="text-gray-400 hover:text-gray-600">
                                View
                              </button>
                          )}
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

      <Modal
        isOpen={!!selectedRental}
        onClose={() => setSelectedRental(null)}
        title="Return Vehicle"
      >
        {selectedRental && (
          <ReturnRentalForm
            rental={selectedRental}
            onSuccess={() => setSelectedRental(null)}
            onCancel={() => setSelectedRental(null)}
          />
        )}
      </Modal>
    </>
  )
}

