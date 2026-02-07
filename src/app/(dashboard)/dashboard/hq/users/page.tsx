'use client'

import { useState, useEffect } from 'react'
import { Plus, Users, Search, Filter, Loader2 } from 'lucide-react'
import { getBranches, getUsers } from '@/lib/api'
import UserList from '@/components/users/UserList'
import UserForm from '@/components/users/UserForm'
import { Branch } from '@/types'
import Modal from '@/components/common/Modal'

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([])
    const [branches, setBranches] = useState<Branch[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const [usersData, branchesData] = await Promise.all([
                getUsers(),
                getBranches()
            ])

            // Enhance users with branch names locally for the list
            const enhancedUsers = usersData.map((user: any) => {
                const branch = branchesData.find(b => b.id === user.branch_id)
                return {
                    ...user,
                    branch_name: branch?.name || null
                }
            })

            setUsers(enhancedUsers)
            setBranches(branchesData)
        } catch (error) {
            console.error('Failed to fetch data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const filteredUsers = users.filter(user =>
        user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-8 pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-[#1a1a1a] flex items-center gap-3">
                        <Users className="h-8 w-8" />
                        Team Management
                    </h1>
                    <p className="text-gray-500 mt-1">Control access and roles for all Marsana staff members.</p>
                </div>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="bg-[#1a1a1a] text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#2d2d2d] transition-all shadow-lg hover:shadow-black/10 active:scale-95"
                >
                    <Plus className="h-5 w-5" />
                    Add New Staff
                </button>
            </div>

            {/* Filters Section */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#1a1a1a] transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by name, email or role..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] transition-all"
                    />
                </div>
                <button className="px-6 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm font-bold text-gray-600 flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
                    <Filter className="h-5 w-5" />
                    Filters
                </button>
            </div>

            {/* List Section */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-gray-300" />
                    <p className="text-gray-400 font-medium tracking-wide">Fetching team details...</p>
                </div>
            ) : (
                <UserList users={filteredUsers} />
            )}

            {/* Create User Modal */}
            <Modal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title="Add New User"
            >
                <UserForm
                    branches={branches}
                    onSuccess={() => {
                        setIsFormOpen(false)
                        fetchData()
                    }}
                    onCancel={() => setIsFormOpen(false)}
                />
            </Modal>
        </div>
    )
}
