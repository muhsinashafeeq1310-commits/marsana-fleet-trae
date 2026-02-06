'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import Modal from '@/components/common/Modal'
import CorporateForm from './CorporateForm'

export default function CorporateFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('search', term)
    } else {
      params.delete('search')
    }
    router.replace(`/corporates?${params.toString()}`)
  }

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams)
    if (status && status !== 'all') {
      params.set('is_active', status === 'active' ? 'true' : 'false')
    } else {
      params.delete('is_active')
    }
    router.replace(`/corporates?${params.toString()}`)
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 bg-white rounded-lg shadow-sm mb-6">
        <div className="flex flex-1 flex-col sm:flex-row gap-4">
          <div className="relative">
             <input
              type="text"
              placeholder="Search companies..."
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              defaultValue={searchParams.get('search')?.toString()}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          <div className="relative">
            <select
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              defaultValue={
                  searchParams.has('is_active') 
                      ? (searchParams.get('is_active') === 'true' ? 'active' : 'inactive') 
                      : 'all'
              }
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <Plus className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            New Corporate
          </button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Corporate Client"
      >
        <CorporateForm
          onSuccess={() => setIsModalOpen(false)}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  )
}
