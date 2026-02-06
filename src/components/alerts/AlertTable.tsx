'use client'

import { Alert } from '@/types'
import { resolveAlert } from '@/lib/actions'
import { format } from 'date-fns'
import { useTransition } from 'react'

interface AlertTableProps {
  alerts: Alert[]
}

export default function AlertTable({ alerts }: AlertTableProps) {
  const [isPending, startTransition] = useTransition()

  const handleResolve = (id: string) => {
    if (confirm('Are you sure you want to resolve this alert?')) {
        startTransition(async () => {
            await resolveAlert(id)
        })
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'LOW':
        return 'bg-blue-50 text-blue-700 ring-blue-600/20'
      case 'MEDIUM':
        return 'bg-yellow-50 text-yellow-800 ring-yellow-600/20'
      case 'HIGH':
        return 'bg-orange-50 text-orange-800 ring-orange-600/20'
      case 'CRITICAL':
        return 'bg-red-50 text-red-700 ring-red-600/20'
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
                    Type
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Severity
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Title
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Message
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
                {alerts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-4 text-center text-sm text-gray-500">
                      No alerts found.
                    </td>
                  </tr>
                ) : (
                  alerts.map((alert) => (
                    <tr key={alert.id} className={alert.is_resolved ? 'opacity-50' : ''}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {alert.type.replace('_', ' ')}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-900 font-medium">
                        {alert.title}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 max-w-sm truncate">
                        {alert.message}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {format(new Date(alert.created_at), 'MMM d, HH:mm')}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        {!alert.is_resolved && (
                            <button 
                                onClick={() => handleResolve(alert.id)}
                                disabled={isPending}
                                className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                            >
                              Resolve<span className="sr-only">, {alert.title}</span>
                            </button>
                        )}
                        {alert.is_resolved && (
                            <span className="text-green-600">Resolved</span>
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
  )
}
