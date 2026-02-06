'use client'

import { MaintenanceTicket } from '@/types'
import { format } from 'date-fns'

interface MaintenanceTableProps {
  tickets: MaintenanceTicket[]
}

export default function MaintenanceTable({ tickets }: MaintenanceTableProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW':
        return 'bg-blue-50 text-blue-700 ring-blue-600/20'
      case 'MEDIUM':
        return 'bg-yellow-50 text-yellow-800 ring-yellow-600/20'
      case 'HIGH':
        return 'bg-orange-50 text-orange-800 ring-orange-600/20'
      case 'URGENT':
        return 'bg-red-50 text-red-700 ring-red-600/20'
      default:
        return 'bg-gray-50 text-gray-600 ring-gray-500/10'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-red-50 text-red-700 ring-red-600/20'
      case 'IN_PROGRESS':
        return 'bg-yellow-50 text-yellow-800 ring-yellow-600/20'
      case 'RESOLVED':
        return 'bg-green-50 text-green-700 ring-green-600/20'
      case 'CLOSED':
        return 'bg-gray-50 text-gray-600 ring-gray-500/10'
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
                    Reference
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Vehicle
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Title
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Priority
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Created
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-4 text-center text-sm text-gray-500">
                      No maintenance tickets found.
                    </td>
                  </tr>
                ) : (
                  tickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {ticket.ticket_ref}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {ticket.vehicles?.plate_no || 'Unknown'}
                        <div className="text-gray-500 font-normal">
                           {ticket.vehicles?.make} {ticket.vehicles?.model}
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {ticket.title}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusColor(ticket.status)}`}>
                          {ticket.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {format(new Date(ticket.created_at), 'MMM d, yyyy')}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button className="text-indigo-600 hover:text-indigo-900">
                          Edit<span className="sr-only">, {ticket.ticket_ref}</span>
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
