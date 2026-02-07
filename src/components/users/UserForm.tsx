'use client'

import { useState, useTransition, useActionState } from 'react'
import { createUser } from '@/lib/actions'
import { Branch, UserRole } from '@/types'
import { Loader2, Mail, User, Phone, Lock, Building2, ShieldCheck, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const roles: { value: UserRole; label: string; description: string }[] = [
    { value: 'super_admin', label: 'Super Admin', description: 'Full system access across all branches' },
    { value: 'hq', label: 'HQ Staff', description: 'Headquarters operations and management' },
    { value: 'branch_admin', label: 'Branch Admin', description: 'Manage vehicles and staff in one branch' },
    { value: 'driver', label: 'Driver', description: 'Perform handshakes and inspections' },
    { value: 'tech', label: 'Technician', description: 'Handle maintenance and repairs' },
    { value: 'corporate_admin', label: 'Corporate Admin', description: 'Client-side fleet monitoring' },
]

export default function UserForm({
    branches,
    onSuccess,
    onCancel
}: {
    branches: Branch[]
    onSuccess: () => void
    onCancel: () => void
}) {
    const [state, formAction, isPending] = useActionState(createUser, { success: false, message: '' })
    const [selectedRole, setSelectedRole] = useState<UserRole>('driver')

    // Handle successful form submission
    if (state.success) {
        onSuccess()
    }

    return (
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col md:flex-row max-w-4xl w-full mx-auto animate-fade-in">
            {/* Sidebar Info */}
            <div className="bg-[#1a1a1a] p-8 md:w-1/3 text-white flex flex-col justify-between">
                <div>
                    <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center mb-6">
                        <User className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Create New Staff</h2>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Assign proper roles to your team members. This will control their access levels across the platform.
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-xs text-gray-500 uppercase tracking-widest font-bold">
                        <ShieldCheck className="h-4 w-4" />
                        Security First
                    </div>
                </div>
            </div>

            {/* Form Area */}
            <div className="p-8 md:w-2/3 max-h-[80vh] overflow-y-auto">
                <form action={formAction} className="space-y-6">
                    {state.message && !state.success && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg text-sm text-red-700 font-medium">
                            {state.message}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-[#1a1a1a] transition-colors" />
                                <input
                                    name="full_name"
                                    required
                                    placeholder="John Doe"
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-[#1a1a1a] transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-[#1a1a1a] transition-colors" />
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="john@marsana.com"
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-[#1a1a1a] transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Phone</label>
                            <div className="relative group">
                                <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-[#1a1a1a] transition-colors" />
                                <input
                                    name="phone"
                                    placeholder="+966..."
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-[#1a1a1a] transition-all"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Initial Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-[#1a1a1a] transition-colors" />
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    placeholder="Minimum 6 characters"
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-[#1a1a1a] transition-all"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Role Assignment</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                                {roles.map((role) => (
                                    <label
                                        key={role.value}
                                        className={cn(
                                            "relative flex flex-col p-4 border-2 rounded-2xl cursor-pointer transition-all hover:bg-gray-50",
                                            selectedRole === role.value
                                                ? "border-[#1a1a1a] bg-gray-50 ring-4 ring-[#1a1a1a]/5"
                                                : "border-gray-100 bg-white"
                                        )}
                                    >
                                        <input
                                            type="radio"
                                            name="role"
                                            value={role.value}
                                            className="sr-only"
                                            onChange={() => setSelectedRole(role.value)}
                                            checked={selectedRole === role.value}
                                        />
                                        <span className="text-sm font-bold text-gray-900">{role.label}</span>
                                        <span className="text-[10px] text-gray-500 leading-tight mt-1">{role.description}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {['branch_admin', 'driver', 'tech'].includes(selectedRole) && (
                            <div className="md:col-span-2 animate-fade-in">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Assign to Branch</label>
                                <div className="relative group">
                                    <Building2 className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-[#1a1a1a] transition-colors" />
                                    <select
                                        name="branch_id"
                                        required
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border-0 rounded-2xl appearance-none focus:ring-2 focus:ring-[#1a1a1a] transition-all"
                                    >
                                        <option value="">Select a branch...</option>
                                        {branches.map(branch => (
                                            <option key={branch.id} value={branch.id}>{branch.name} ({branch.code})</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-3 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="px-8 py-3 bg-[#1a1a1a] text-white rounded-2xl text-sm font-bold shadow-lg hover:shadow-black/10 transition-all active:scale-95 disabled:opacity-50 inline-flex items-center gap-2"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Staff Member'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
