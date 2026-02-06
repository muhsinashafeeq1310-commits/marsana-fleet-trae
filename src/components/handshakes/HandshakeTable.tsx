'use client'

import { Handshake } from '@/types'
import { StatusChip } from '@/components/common/StatusChip'
import { Eye, CheckCircle, XCircle, Truck, MapPin } from 'lucide-react'
import { useState, useTransition } from 'react'
import { acceptHandshake, rejectHandshake, markHandshakeInTransit, completeHandshake } from '@/lib/actions'
import ConfirmModal from '@/components/common/ConfirmModal'

interface HandshakeTableProps {
  handshakes: Handshake[]
}

export default function HandshakeTable({ handshakes }: HandshakeTableProps) {
  const [isPending, startTransition] = useTransition()
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [completingId, setCompletingId] = useState<string | null>(null)

  const handleAction = async (action: Function, id: string, args: any[] = []) => {
    startTransition(async () => {
      const result = await action(id, ...args)
      if (!result.success) {
        alert(result.message)
      }
      setRejectingId(null)
      setCompletingId(null)
    })
  }

  if (handshakes.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
        <p className="text-gray-500">No handshakes found.</p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ref
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ETA
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {handshakes.map((handshake) => (
                <tr key={handshake.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {handshake.handshake_ref}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">{handshake.vehicles?.plate_no}</span>
                      <span className="text-xs text-gray-500">{handshake.vehicles?.make} {handshake.vehicles?.model}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                     <div className="flex flex-col gap-1">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        From: <span className="font-medium text-gray-700">{handshake.from_branch?.name}</span>
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        To: <span className="font-medium text-gray-700">{handshake.to_branch?.name}</span>
                      </span>
                     </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusChip status={handshake.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {handshake.eta ? new Date(handshake.eta).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      {/* Action Buttons based on Status */}
                      {handshake.status === 'PENDING' && (
                        <>
                          <button 
                            className="text-green-600 hover:text-green-900 p-1"
                            title="Accept"
                            disabled={isPending}
                            onClick={() => handleAction(acceptHandshake, handshake.id)}
                          >
                            <CheckCircle className="h-5 w-5" />
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Reject"
                            disabled={isPending}
                            onClick={() => setRejectingId(handshake.id)}
                          >
                            <XCircle className="h-5 w-5" />
                          </button>
                        </>
                      )}

                      {handshake.status === 'ACCEPTED' && (
                        <button 
                          className="text-purple-600 hover:text-purple-900 p-1"
                          title="Mark In Transit"
                          disabled={isPending}
                          onClick={() => handleAction(markHandshakeInTransit, handshake.id)}
                        >
                          <Truck className="h-5 w-5" />
                        </button>
                      )}

                      {handshake.status === 'IN_TRANSIT' && (
                        <button 
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Complete Transfer"
                          disabled={isPending}
                          onClick={() => setCompletingId(handshake.id)}
                        >
                          <MapPin className="h-5 w-5" />
                        </button>
                      )}

                      <button 
                        className="text-gray-400 hover:text-gray-600 p-1"
                        title="View Details"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Confirmation Modal */}
      <ConfirmModal
        isOpen={!!rejectingId}
        onClose={() => setRejectingId(null)}
        onConfirm={() => rejectingId && handleAction(rejectHandshake, rejectingId, ['Rejected by user'])}
        title="Reject Handshake"
        message="Are you sure you want to reject this transfer request?"
        isLoading={isPending}
      />

      {/* Complete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!completingId}
        onClose={() => setCompletingId(null)}
        onConfirm={() => completingId && handleAction(completeHandshake, completingId)}
        title="Complete Handshake"
        message="This will mark the vehicle as arrived at the destination branch and set its status to Pending Inspection. Continue?"
        isLoading={isPending}
      />
    </>
  )
}
