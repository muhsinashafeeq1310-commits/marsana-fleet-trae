'use client'

import { Corporate } from '@/types'
import { format } from 'date-fns'
import { useState } from 'react'
import Modal from '@/components/common/Modal'
import CorporateForm from './CorporateForm'

interface CorporateTableProps {
  corporates: Corporate[]
}

export default function CorporateTable({ corporates }: CorporateTableProps) {
  const [selectedCorporate, setSelectedCorporate] = useState<Corporate | null>(null)

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
                      Company Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Contact
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      MSA Expiry
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {corporates.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-sm text-gray-500">
                        No corporate clients found.
                      </td>
                    </tr>
                  ) : (
                    corporates.map((corporate) => (
                      <tr key={corporate.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {corporate.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="font-medium text-gray-900">{corporate.contact_person}</div>
                          <div className="text-xs text-gray-400">{corporate.contact_email}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {corporate.msa_expiry_date 
                            ? format(new Date(corporate.msa_expiry_date), 'MMM d, yyyy')
                            : '-'
                          }
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                            corporate.is_active 
                              ? 'bg-green-50 text-green-700 ring-green-600/20' 
                              : 'bg-red-50 text-red-700 ring-red-600/20'
                          }`}>
                            {corporate.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button 
                            onClick={() => setSelectedCorporate(corporate)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit<span className="sr-only">, {corporate.name}</span>
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

      <Modal
        isOpen={!!selectedCorporate}
        onClose={() => setSelectedCorporate(null)}
        title="Edit Corporate Client"
      >
        <CorporateForm
          corporate={selectedCorporate}
          onSuccess={() => setSelectedCorporate(null)}
          onCancel={() => setSelectedCorporate(null)}
        />
      </Modal>
    </>
  )
}
