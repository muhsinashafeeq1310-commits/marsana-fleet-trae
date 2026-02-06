'use client'

import { Branch, Vehicle } from '@/types'
import { useRouter, useSearchParams } from 'next/navigation'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import Modal from '@/components/common/Modal'
import HandshakeForm from './HandshakeForm'

interface HandshakeFiltersProps {
  branches: Branch[]
  vehicles: Vehicle[]
}

export default function HandshakeFilters({ branches, vehicles }: HandshakeFiltersProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams)
    if (status && status !== 'all') {
      params.set('status', status)
    } else {
      params.delete('status')
    }
    router.replace(`/handshakes?${params.toString()}`)
  }

  const handleFromBranchChange = (branchId: string) => {
    const params = new URLSearchParams(searchParams)
    if (branchId && branchId !== 'all') {
      params.set('from_branch', branchId)
    } else {
      params.delete('from_branch')
    }
    router.replace(`/handshakes?${params.toString()}`)
  }

  const handleToBranchChange = (branchId: string) => {
    const params = new URLSearchParams(searchParams)
    if (branchId && branchId !== 'all') {
      params.set('to_branch', branchId)
    } else {
      params.delete('to_branch')
    }
    router.replace(`/handshakes?${params.toString()}`)
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 bg-white rounded-lg shadow-sm mb-6">
        <div className="flex flex-1 flex-col sm:flex-row gap-4">
          {/* Status Filter */}
          <div className="relative">
            <label htmlFor="status" className="sr-only">Status</label>
            <select
              id="status"
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              defaultValue={searchParams.get('status')?.toString() || 'all'}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* From Branch Filter */}
          <div className="relative">
            <label htmlFor="from_branch" className="sr-only">From Branch</label>
            <select
              id="from_branch"
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              defaultValue={searchParams.get('from_branch')?.toString() || 'all'}
              onChange={(e) => handleFromBranchChange(e.target.value)}
            >
              <option value="all">From: All Branches</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  From: {branch.name}
                </option>
              ))}
            </select>
          </div>

          {/* To Branch Filter */}
          <div className="relative">
            <label htmlFor="to_branch" className="sr-only">To Branch</label>
            <select
              id="to_branch"
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              defaultValue={searchParams.get('to_branch')?.toString() || 'all'}
              onChange={(e) => handleToBranchChange(e.target.value)}
            >
              <option value="all">To: All Branches</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  To: {branch.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <Plus className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            Create Handshake
          </button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Handshake Request"
      >
        <HandshakeForm
          vehicles={vehicles}
          branches={branches}
          onSuccess={() => setIsModalOpen(false)}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  )
}
