import { supabase } from '@/lib/supabase'
import { Vehicle, Branch, Inspection, MaintenanceTicket, Corporate, VehicleStatus, HandshakeStatus, InspectionResult, MaintenancePriority, AlertType } from '@/types'

// ... existing imports

export async function getCorporates(filters?: {
  search?: string
  is_active?: boolean
}) {
  let query = supabase
    .from('corporates')
    .select('*')
    .order('name')

  if (filters?.search) {
    query = query.ilike('name', `%${filters.search}%`)
  }

  if (filters?.is_active !== undefined) {
    query = query.eq('is_active', filters.is_active)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching corporates:', error)
    throw new Error('Failed to fetch corporates')
  }

  return data as Corporate[]
}

export async function getRentals(filters?: {
  status?: string
  search?: string
}) {
  let query = supabase
    .from('rentals')
    .select(`
      *,
      vehicles (
        id,
        plate_no,
        make,
        model
      ),
      corporates (
        id,
        name
      )
    `)
    .order('created_at', { ascending: false })

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status)
  }

  if (filters?.search) {
    query = query.or(`customer_name.ilike.%${filters.search}%,contract_no.ilike.%${filters.search}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching rentals:', error)
    throw new Error('Failed to fetch rentals')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data as unknown as any[]
}

export async function getUsers(role?: string) {
  let query = supabase
    .from('users')
    .select('id, full_name, email, role, phone, branch_id')
    .order('full_name')

  if (role) {
    query = query.eq('role', role)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching users:', error)
    throw new Error('Failed to fetch users')
  }

  return data
}

export async function getAlerts(filters?: {
  type?: AlertType | 'all'
  is_resolved?: boolean
}) {
  let query = supabase
    .from('alerts')
    .select('*')
    .order('created_at', { ascending: false })

  if (filters?.type && filters.type !== 'all') {
    query = query.eq('type', filters.type)
  }

  if (filters?.is_resolved !== undefined) {
    query = query.eq('is_resolved', filters.is_resolved)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching alerts:', error)
    throw new Error('Failed to fetch alerts')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data as unknown as any[]
}

export async function getMaintenanceTickets(filters?: {
  vehicle_id?: string
  priority?: MaintenancePriority
  status?: string
}) {
  let query = supabase
    .from('maintenance_tickets')
    .select(`
      *,
      vehicles (
        id,
        plate_no,
        make,
        model
      ),
      assigned:assigned_to (
        full_name,
        email
      )
    `)
    .order('created_at', { ascending: false })

  if (filters?.vehicle_id && filters.vehicle_id !== 'all') {
    query = query.eq('vehicle_id', filters.vehicle_id)
  }

  if (filters?.priority && (filters.priority as string) !== 'all') {
    query = query.eq('priority', filters.priority)
  }

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching maintenance tickets:', error)
    throw new Error('Failed to fetch maintenance tickets')
  }

  return data as MaintenanceTicket[]
}


export async function getVehicles(filters?: {
  plate_no?: string
  status?: VehicleStatus
  branch_id?: string
}) {
  let query = supabase
    .from('vehicles')
    .select(`
      *,
      branches (
        id,
        name,
        code
      )
    `)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (filters?.plate_no) {
    query = query.ilike('plate_no', `%${filters.plate_no}%`)
  }

  if (filters?.status) {
    query = query.eq('current_status', filters.status)
  }

  if (filters?.branch_id && filters.branch_id !== 'all') {
    query = query.eq('current_branch_id', filters.branch_id)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching vehicles:', error)
    throw new Error('Failed to fetch vehicles')
  }

  return data as Vehicle[]
}

export async function getBranches() {
  const { data, error } = await supabase
    .from('branches')
    .select('*')
    .eq('is_active', true)
    .order('name')

  if (error) {
    console.error('Error fetching branches:', error)
    throw new Error('Failed to fetch branches')
  }

  return data as Branch[]
}

export async function getHandshakes(filters?: {
  status?: HandshakeStatus
  from_branch_id?: string
  to_branch_id?: string
}) {
  let query = supabase
    .from('handshakes')
    .select(`
      *,
      vehicles (
        id,
        plate_no,
        make,
        model
      ),
      from_branch:from_branch_id (
        id,
        name,
        code
      ),
      to_branch:to_branch_id (
        id,
        name,
        code
      )
    `)
    .order('created_at', { ascending: false })

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  if (filters?.from_branch_id && filters.from_branch_id !== 'all') {
    query = query.eq('from_branch_id', filters.from_branch_id)
  }

  if (filters?.to_branch_id && filters.to_branch_id !== 'all') {
    query = query.eq('to_branch_id', filters.to_branch_id)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching handshakes:', error)
    throw new Error('Failed to fetch handshakes')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data as unknown as any[]
}

export async function getInspections(filters?: {
  vehicle_id?: string
  result?: InspectionResult | 'all'
}) {
  let query = supabase
    .from('inspections')
    .select(`
      *,
      vehicles (
        id,
        plate_no,
        make,
        model
      ),
      performer:performed_by (
        full_name,
        email
      )
    `)
    .order('created_at', { ascending: false })

  if (filters?.vehicle_id && filters.vehicle_id !== 'all') {
    query = query.eq('vehicle_id', filters.vehicle_id)
  }

  if (filters?.result && filters.result !== 'all') {
    query = query.eq('result', filters.result)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching inspections:', error)
    throw new Error('Failed to fetch inspections')
  }

  return data as Inspection[]
}

export async function getDashboardMetrics() {
  const [
    { count: totalVehicles },
    { count: onRentVehicles },
    { count: maintenanceVehicles },
    { count: activeAlerts }
  ] = await Promise.all([
    supabase.from('vehicles').select('*', { count: 'exact', head: true }).is('deleted_at', null),
    supabase.from('vehicles').select('*', { count: 'exact', head: true }).eq('current_status', 'ON_RENT').is('deleted_at', null),
    supabase.from('vehicles').select('*', { count: 'exact', head: true }).eq('current_status', 'MAINTENANCE').is('deleted_at', null),
    supabase.from('alerts').select('*', { count: 'exact', head: true }).eq('is_resolved', false)
  ])

  const utilizationRate = totalVehicles ? Math.round((onRentVehicles || 0) / totalVehicles * 100) : 0

  return {
    totalVehicles: totalVehicles || 0,
    onRentVehicles: onRentVehicles || 0,
    maintenanceVehicles: maintenanceVehicles || 0,
    activeAlerts: activeAlerts || 0,
    utilizationRate
  }
}

export async function getDriverAssignments(driverId: string) {
  // Fetch vehicles assigned to driver
  const { data: vehicles } = await supabase
    .from('vehicles')
    .select('*')
    .eq('assigned_driver_id', driverId)
    .is('deleted_at', null)

  // Fetch active tasks (Handshakes) where driver is the requester or acceptor?
  // Or maybe specific tasks. For now let's just show assigned vehicles and recent alerts.

  return {
    vehicles: vehicles as Vehicle[] || []
  }
}


