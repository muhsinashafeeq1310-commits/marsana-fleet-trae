'use server'

import { supabaseAdmin } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { Vehicle, VehicleStatus } from '@/types'
import { logger } from '@/lib/logger'
import type { ActionState } from '@/lib/action-types'

const REQUIRED_FIELDS = ['plate_no', 'make', 'model', 'current_status', 'current_branch_id']

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validateVehicle(formData: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errors: any = {}
  REQUIRED_FIELDS.forEach((field) => {
    if (!formData.get(field)) {
      errors[field] = `${field.replace(/_/g, ' ')} is required`
    }
  })

  // Validate VIN length (must not exceed 17 characters)
  const vin = formData.get('vin')
  if (vin && vin.length > 17) {
    errors.vin = 'VIN cannot be longer than 17 characters'
  }

  return errors
}

// Helper to get current user - in production this would verify auth session
async function getCurrentUser() {
  const { data: users } = await supabaseAdmin.from('users').select('id, branch_id').limit(1)
  return users?.[0]
}

export async function createVehicle(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const errors = validateVehicle(formData)

  if (Object.keys(errors).length > 0) {
    const formattedErrors: Record<string, string[]> = {}
    Object.keys(errors).forEach((key) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formattedErrors[key] = [(errors as any)[key]]
    })
    return { success: false, errors: formattedErrors, message: 'Please fix the errors below' }
  }

  // Auth check
  const user = await getCurrentUser()
  if (!user) {
    logger.warn('Unauthorized attempt to create vehicle')
    return { success: false, message: 'Unauthorized' }
  }

  const vehicleData: Partial<Vehicle> = {
    plate_no: formData.get('plate_no') as string,
    vin: formData.get('vin') as string || null,
    make: formData.get('make') as string,
    model: formData.get('model') as string,
    year: formData.get('year') ? Number(formData.get('year')) : null,
    color: formData.get('color') as string || null,
    mileage: formData.get('mileage') ? Number(formData.get('mileage')) : 0,
    fuel_type: formData.get('fuel_type') as string || null,
    current_status: formData.get('current_status') as VehicleStatus,
    current_branch_id: formData.get('current_branch_id') as string,
    assigned_driver_id: formData.get('assigned_driver_id') as string || null,
    purchase_date: formData.get('purchase_date') as string || null,
    purchase_price: formData.get('purchase_price') ? Number(formData.get('purchase_price')) : null,
    insurance_expiry: formData.get('insurance_expiry') as string || null,
    registration_expiry: formData.get('registration_expiry') as string || null,
    next_service_due: formData.get('next_service_due') as string || null,
    next_service_mileage: formData.get('next_service_mileage') ? Number(formData.get('next_service_mileage')) : null,
    notes: formData.get('notes') as string || null,
    version: 1
  }

  try {
    const { error } = await supabaseAdmin
      .from('vehicles')
      .insert(vehicleData)

    if (error) {
      if (error.code === '23505') { // Unique violation
        return { success: false, message: 'Vehicle with this Plate No or VIN already exists' }
      }
      throw error
    }

    logger.info('Vehicle created', { plate_no: vehicleData.plate_no, created_by: user.id })
    revalidatePath('/vehicles')
    return { success: true, message: 'Vehicle created successfully' }
  } catch (error: unknown) {
    logger.error('Create vehicle error', error)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const message = error instanceof Error ? error.message : (error as any)?.message || 'Unknown error'
    return { success: false, message: 'Failed to create vehicle: ' + message }
  }
}

export async function updateVehicle(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const id = formData.get('id') as string
  const version = Number(formData.get('version'))

  if (!id) return { success: false, message: 'Vehicle ID is missing' }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errors = validateVehicle(formData as any)
  if (Object.keys(errors).length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { success: false, errors: errors as any, message: 'Please fix the errors below' }
  }

  const vehicleData: Partial<Vehicle> = {
    plate_no: formData.get('plate_no') as string,
    vin: formData.get('vin') as string || null,
    make: formData.get('make') as string,
    model: formData.get('model') as string,
    year: formData.get('year') ? Number(formData.get('year')) : null,
    color: formData.get('color') as string || null,
    mileage: formData.get('mileage') ? Number(formData.get('mileage')) : 0,
    fuel_type: formData.get('fuel_type') as string || null,
    current_status: formData.get('current_status') as VehicleStatus,
    current_branch_id: formData.get('current_branch_id') as string,
    assigned_driver_id: formData.get('assigned_driver_id') as string || null,
    purchase_date: formData.get('purchase_date') as string || null,
    purchase_price: formData.get('purchase_price') ? Number(formData.get('purchase_price')) : null,
    insurance_expiry: formData.get('insurance_expiry') as string || null,
    registration_expiry: formData.get('registration_expiry') as string || null,
    next_service_due: formData.get('next_service_due') as string || null,
    next_service_mileage: formData.get('next_service_mileage') ? Number(formData.get('next_service_mileage')) : null,
    notes: formData.get('notes') as string || null,
    version: version + 1
  }

  try {
    // Optimistic locking check: update where id = id AND version = old_version
    const { data, error } = await supabaseAdmin
      .from('vehicles')
      .update(vehicleData)
      .eq('id', id)
      .eq('version', version)
      .select()

    if (error) {
      if (error.code === '23505') { // Unique violation
        return { success: false, message: 'Vehicle with this Plate No or VIN already exists' }
      }
      throw error
    }

    if (!data || data.length === 0) {
      return { success: false, message: 'Update failed. The vehicle was modified by another user. Please refresh and try again.' }
    }

    revalidatePath('/vehicles')
    return { success: true, message: 'Vehicle updated successfully' }
  } catch (error: unknown) {
    logger.error('Update vehicle error', error)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const message = error instanceof Error ? error.message : (error as any)?.message || 'Unknown error'
    return { success: false, message: 'Failed to update vehicle: ' + message }
  }
}

export async function deleteVehicle(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const id = formData.get('id') as string

  if (!id) return { success: false, message: 'Vehicle ID is missing' }

  try {
    const { error } = await supabaseAdmin
      .from('vehicles')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error

    revalidatePath('/vehicles')
    return { success: true, message: 'Vehicle deleted successfully' }
  } catch (error: unknown) {
    logger.error('Delete vehicle error', error)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const message = error instanceof Error ? error.message : (error as any)?.message || 'Unknown error'
    return { success: false, message: 'Failed to delete vehicle: ' + message }
  }
}

export async function restoreVehicle(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const id = formData.get('id') as string

  if (!id) return { success: false, message: 'Vehicle ID is missing' }

  try {
    const { error } = await supabaseAdmin
      .from('vehicles')
      .update({ deleted_at: null })
      .eq('id', id)

    if (error) throw error

    revalidatePath('/vehicles')
    return { success: true, message: 'Vehicle restored successfully' }
  } catch (error: unknown) {
    logger.error('Restore vehicle error', error)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const message = error instanceof Error ? error.message : (error as any)?.message || 'Unknown error'
    return { success: false, message: 'Failed to restore vehicle: ' + message }
  }
}

// --- Handshake Actions ---

export async function createHandshake(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const vehicle_id = formData.get('vehicle_id') as string
  const from_branch_id = formData.get('from_branch_id') as string
  const to_branch_id = formData.get('to_branch_id') as string
  const notes = formData.get('notes') as string
  const eta = formData.get('eta') as string

  if (!vehicle_id || !from_branch_id || !to_branch_id) {
    return { success: false, message: 'Missing required fields' }
  }

  // Auth check
  const user = await getCurrentUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }
  const requested_by = user.id

  // Generate Handshake Ref (Simple timestamp based)
  const handshake_ref = `HS-${Date.now().toString().slice(-6)}`

  try {
    // 1. Verify vehicle is AVAILABLE and in from_branch
    const { data: vehicle, error: vehicleError } = await supabaseAdmin
      .from('vehicles')
      .select('current_status, current_branch_id')
      .eq('id', vehicle_id)
      .single()

    if (vehicleError || !vehicle) throw new Error('Vehicle not found')

    if (vehicle.current_branch_id !== from_branch_id) {
      return { success: false, message: 'Vehicle is not at the source branch' }
    }
    if (vehicle.current_status !== 'AVAILABLE') {
      return { success: false, message: 'Vehicle is not AVAILABLE' }
    }

    // 2. Create Handshake
    const { error } = await supabaseAdmin
      .from('handshakes')
      .insert({
        handshake_ref,
        vehicle_id,
        from_branch_id,
        to_branch_id,
        status: 'PENDING',
        requested_by,
        notes,
        eta: eta || null
      })

    if (error) throw error

    revalidatePath('/handshakes')
    revalidatePath('/vehicles')
    return { success: true, message: 'Handshake created successfully' }
  } catch (error: unknown) {
    logger.error('Create handshake error', error)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const message = error instanceof Error ? error.message : (error as any)?.message || 'Unknown error'
    return { success: false, message: 'Failed to create handshake: ' + message }
  }
}

export async function acceptHandshake(id: string): Promise<ActionState> {
  // Auth check
  const user = await getCurrentUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }
  const accepted_by = user.id

  try {
    const { data: handshake } = await supabaseAdmin.from('handshakes').select('status, vehicle_id').eq('id', id).single()
    if (handshake?.status !== 'PENDING') {
      return { success: false, message: 'Handshake is not in PENDING state' }
    }

    // Update Handshake
    const { error: hsError } = await supabaseAdmin
      .from('handshakes')
      .update({
        status: 'ACCEPTED',
        accepted_by,
      })
      .eq('id', id)

    if (hsError) throw hsError

    // Update Vehicle
    const { error: vError } = await supabaseAdmin
      .from('vehicles')
      .update({ current_status: 'IN_TRANSIT' })
      .eq('id', handshake.vehicle_id)

    if (vError) {
      await supabaseAdmin.from('handshakes').update({ status: 'PENDING', accepted_by: null }).eq('id', id)
      throw vError
    }

    revalidatePath('/handshakes')
    revalidatePath('/vehicles')
    return { success: true, message: 'Handshake accepted' }
  } catch (error: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const message = error instanceof Error ? error.message : (error as any)?.message || 'Unknown error'
    return { success: false, message: message }
  }
}

export async function rejectHandshake(id: string, reason: string): Promise<ActionState> {
  // Auth check
  const user = await getCurrentUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }
  // const rejected_by = user.id

  try {
    const { data: handshake } = await supabaseAdmin.from('handshakes').select('status').eq('id', id).single()
    if (handshake?.status !== 'PENDING') {
      return { success: false, message: 'Handshake is not in PENDING state' }
    }

    const { error } = await supabaseAdmin
      .from('handshakes')
      .update({
        status: 'REJECTED',
        rejection_reason: reason
      })
      .eq('id', id)

    if (error) throw error

    revalidatePath('/handshakes')
    revalidatePath('/vehicles')
    return { success: true, message: 'Handshake completed' }
  } catch (error: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const message = error instanceof Error ? error.message : (error as any)?.message || 'Unknown error'
    return { success: false, message: message }
  }
}

export async function markHandshakeInTransit(id: string): Promise<ActionState> {
  try {
    const { data: handshake } = await supabaseAdmin.from('handshakes').select('status').eq('id', id).single()
    if (handshake?.status !== 'ACCEPTED') {
      return { success: false, message: 'Handshake must be ACCEPTED first' }
    }

    const { error } = await supabaseAdmin
      .from('handshakes')
      .update({
        status: 'IN_TRANSIT',
        actual_departure_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) throw error

    revalidatePath('/handshakes')
    revalidatePath('/vehicles')
    return { success: true, message: 'Handshake marked as In Transit' }
  } catch (error: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const message = error instanceof Error ? error.message : (error as any)?.message || 'Unknown error'
    return { success: false, message: message }
  }
}

export async function completeHandshake(id: string): Promise<ActionState> {
  // Auth check
  const user = await getCurrentUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }
  const completed_by = user.id

  try {
    const { data: handshake } = await supabaseAdmin.from('handshakes').select('*').eq('id', id).single()
    if (handshake?.status !== 'IN_TRANSIT') {
      return { success: false, message: 'Handshake must be IN_TRANSIT to complete' }
    }

    // 1. Update Handshake
    const { error: hsError } = await supabaseAdmin
      .from('handshakes')
      .update({
        status: 'COMPLETED',
        completed_by,
        actual_arrival_at: new Date().toISOString()
      })
      .eq('id', id)

    if (hsError) throw hsError

    // 2. Update Vehicle (Move to new branch, set status PENDING_INSPECTION)
    const { error: vError } = await supabaseAdmin
      .from('vehicles')
      .update({
        current_status: 'PENDING_INSPECTION',
        current_branch_id: handshake.to_branch_id
      })
      .eq('id', handshake.vehicle_id)

    if (vError) {
      throw vError
    }

    revalidatePath('/handshakes')
    revalidatePath('/vehicles')
    return { success: true, message: 'Handshake completed' }
  } catch (error: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const message = error instanceof Error ? error.message : (error as any)?.message || 'Unknown error'
    return { success: false, message: message }
  }
}

// --- Inspection Actions ---

export async function createInspection(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const vehicle_id = formData.get('vehicle_id') as string
  const mileage = Number(formData.get('mileage'))
  const result = formData.get('result') as string
  const notes = formData.get('notes') as string
  const checklist = formData.get('checklist') as string // JSON string
  const photos = formData.get('photos') as string // JSON string of URLs

  if (!vehicle_id || isNaN(mileage) || !result) {
    return { success: false, message: 'Missing required fields' }
  }

  // Auth check
  const user = await getCurrentUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }
  const performed_by = user.id

  try {
    // 1. Insert Inspection
    const { data: inspection, error } = await supabaseAdmin
      .from('inspections')
      .insert({
        vehicle_id,
        inspection_type: 'ROUTINE', // Default
        mileage,
        result,
        checklist: checklist ? JSON.parse(checklist) : {},
        notes,
        photos: photos ? JSON.parse(photos) : [],
        performed_by,
        performed_at: new Date().toISOString()
      })
      .select('id')
      .single()

    if (error) throw error

    // 2. Fetch Vehicle for side effects
    const { data: vehicle, error: vError } = await supabaseAdmin
      .from('vehicles')
      .select('plate_no, current_status, current_branch_id')
      .eq('id', vehicle_id)
      .single()

    if (vError || !vehicle) {
      console.error('Vehicle not found for inspection side effects', vError)
      throw new Error('Vehicle not found')
    }

    // 3. Handle Side Effects
    if (result === 'DAMAGE' || result === 'SERVICE_DUE') {
      // A. Create Maintenance Ticket
      const ticket_ref = `MT-${Date.now().toString().slice(-6)}`
      const { error: ticketError } = await supabaseAdmin
        .from('maintenance_tickets')
        .insert({
          ticket_ref,
          vehicle_id,
          title: `Inspection found ${result} on ${vehicle.plate_no}`,
          description: `Automatically created from inspection. Notes: ${notes}`,
          priority: result === 'DAMAGE' ? 'HIGH' : 'MEDIUM',
          status: 'OPEN',
          related_inspection_id: inspection.id
        })

      if (ticketError) console.error('Failed to create maintenance ticket', ticketError)

      // B. Create Alert
      const { error: alertError } = await supabaseAdmin
        .from('alerts')
        .insert({
          type: 'MAINTENANCE_DUE',
          severity: result === 'DAMAGE' ? 'HIGH' : 'MEDIUM',
          title: `Maintenance Required: ${vehicle.plate_no}`,
          message: `Inspection result: ${result}. Check maintenance tickets.`,
          reference_type: 'inspections',
          reference_id: inspection.id,
          branch_id: vehicle.current_branch_id,
          vehicle_id,
          assigned_to: null // Unassigned initially
        })

      if (alertError) console.error('Failed to create alert', alertError)

      // C. Update Vehicle Status
      const { error: updateError } = await supabaseAdmin
        .from('vehicles')
        .update({ current_status: 'MAINTENANCE' })
        .eq('id', vehicle_id)

      if (updateError) console.error('Failed to update vehicle status', updateError)

    } else if (result === 'CLEAN' && vehicle.current_status === 'PENDING_INSPECTION') {
      // D. Update Vehicle Status to AVAILABLE
      const { error: updateError } = await supabaseAdmin
        .from('vehicles')
        .update({ current_status: 'AVAILABLE' })
        .eq('id', vehicle_id)

      if (updateError) console.error('Failed to update vehicle status', updateError)
    }

    revalidatePath('/inspections')
    revalidatePath('/vehicles')
    revalidatePath('/alerts')
    return { success: true, message: 'Inspection created successfully' }
  } catch (error: unknown) {
    logger.error('Create inspection error:', error)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const message = error instanceof Error ? error.message : (error as any)?.message || 'Unknown error'
    return { success: false, message: 'Failed to create inspection: ' + message }
  }
}

// --- Alert Actions ---

export async function resolveAlert(id: string): Promise<ActionState> {
  // Mock user
  const { data: users } = await supabaseAdmin.from('users').select('id').limit(1)
  const resolved_by = users?.[0]?.id

  try {
    const { error } = await supabaseAdmin
      .from('alerts')
      .update({
        is_resolved: true,
        resolved_at: new Date().toISOString(),
        resolved_by
      })
      .eq('id', id)

    if (error) throw error

    revalidatePath('/alerts')
    return { success: true, message: 'Alert resolved' }
  } catch (error: unknown) {
    logger.error('Resolve alert error:', error)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const message = error instanceof Error ? error.message : (error as any)?.message || 'Unknown error'
    return { success: false, message: 'Failed to resolve alert: ' + message }
  }
}

// --- Rental Actions ---

export async function createRental(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const vehicle_id = formData.get('vehicle_id') as string
  const customer_name = formData.get('customer_name') as string
  const customer_phone = formData.get('customer_phone') as string
  const start_at = formData.get('start_at') as string
  const end_at = formData.get('end_at') as string
  const start_mileage = Number(formData.get('start_mileage'))
  const start_fuel_level = formData.get('start_fuel_level') as string
  const corporate_id = formData.get('corporate_id') as string

  if (!vehicle_id || !customer_name || !start_at || !end_at) {
    return { success: false, message: 'Missing required fields' }
  }

  // Auth check
  const user = await getCurrentUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }
  const created_by = user.id

  const contract_no = `RA-${Date.now().toString().slice(-6)}`

  try {
    // 1. Create Rental
    const { error: rentalError } = await supabaseAdmin
      .from('rentals')
      .insert({
        contract_no,
        vehicle_id,
        customer_name,
        customer_phone,
        start_at,
        end_at,
        start_mileage,
        start_fuel_level,
        corporate_id: corporate_id || null,
        status: 'ACTIVE',
        created_by
      })

    if (rentalError) throw rentalError

    // 2. Update Vehicle Status
    const { error: vehicleError } = await supabaseAdmin
      .from('vehicles')
      .update({ current_status: 'ON_RENT' })
      .eq('id', vehicle_id)

    if (vehicleError) {
      // Rollback rental?
      console.error('Failed to update vehicle status for rental', vehicleError)
      // Ideally delete the rental we just made
    }

    revalidatePath('/rentals')
    revalidatePath('/vehicles')
    return { success: true, message: 'Rental created successfully' }
  } catch (error: unknown) {
    logger.error('Create rental error:', error)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const message = error instanceof Error ? error.message : (error as any)?.message || 'Unknown error'
    return { success: false, message: 'Failed to create rental: ' + message }
  }
}

export async function closeRental(id: string, formData: FormData): Promise<ActionState> {
  // This is slightly different because we might call it from a form or just a button.
  // For now, let's assume it's called from a "Return Vehicle" modal form.
  const end_mileage = Number(formData.get('end_mileage'))
  const end_fuel_level = formData.get('end_fuel_level') as string
  const actual_return_at = new Date().toISOString()

  try {
    const { data: rental } = await supabaseAdmin.from('rentals').select('vehicle_id').eq('id', id).single()
    if (!rental) throw new Error('Rental not found')

    // 1. Update Rental
    const { error: rentalError } = await supabaseAdmin
      .from('rentals')
      .update({
        status: 'COMPLETED',
        actual_return_at,
        end_mileage,
        end_fuel_level
      })
      .eq('id', id)

    if (rentalError) throw rentalError

    // 2. Update Vehicle Status
    const { error: vehicleError } = await supabaseAdmin
      .from('vehicles')
      .update({
        current_status: 'PENDING_INSPECTION',
        mileage: end_mileage // Update vehicle mileage to the return mileage
      })
      .eq('id', rental.vehicle_id)

    if (vehicleError) console.error('Failed to update vehicle status after rental return', vehicleError)

    revalidatePath('/rentals')
    revalidatePath('/vehicles')
    return { success: true, message: 'Rental closed successfully' }
  } catch (error: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const message = error instanceof Error ? error.message : (error as any)?.message || 'Unknown error'
    return { success: false, message: message }
  }
}

export async function createCorporate(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const name = formData.get('name') as string
  const contact_person = formData.get('contact_person') as string
  const contact_email = formData.get('contact_email') as string
  const contact_phone = formData.get('contact_phone') as string
  const msa_expiry_date = formData.get('msa_expiry_date') as string

  if (!name) {
    return { success: false, message: 'Name is required' }
  }

  try {
    const { error } = await supabaseAdmin
      .from('corporates')
      .insert({
        name,
        contact_person,
        contact_email,
        contact_phone,
        msa_expiry_date: msa_expiry_date || null,
        is_active: true
      })

    if (error) throw error

    revalidatePath('/corporates')
    return { success: true, message: 'Corporate created successfully' }
  } catch (error: unknown) {
    logger.error('Create corporate error', error)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const message = error instanceof Error ? error.message : (error as any)?.message || 'Unknown error'
    return { success: false, message: 'Failed to create corporate: ' + message }
  }
}

export async function updateCorporate(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const contact_person = formData.get('contact_person') as string
  const contact_email = formData.get('contact_email') as string
  const contact_phone = formData.get('contact_phone') as string
  const msa_expiry_date = formData.get('msa_expiry_date') as string
  const is_active = formData.get('is_active') === 'on'

  if (!id || !name) {
    return { success: false, message: 'ID and Name are required' }
  }

  try {
    const { error } = await supabaseAdmin
      .from('corporates')
      .update({
        name,
        contact_person,
        contact_email,
        contact_phone,
        msa_expiry_date: msa_expiry_date || null,
        is_active
      })
      .eq('id', id)

    if (error) throw error

    revalidatePath('/corporates')
    return { success: true, message: 'Corporate updated successfully' }
  } catch (error: unknown) {
    logger.error('Update corporate error', error)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const message = error instanceof Error ? error.message : (error as any)?.message || 'Unknown error'
    return { success: false, message: 'Failed to update corporate: ' + message }
  }
}

export async function deleteCorporate(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const id = formData.get('id') as string

  if (!id) return { success: false, message: 'Corporate ID is missing' }

  try {
    const { error } = await supabaseAdmin
      .from('corporates')
      .delete()
      .eq('id', id)

    if (error) throw error

    revalidatePath('/corporates')
    return { success: true, message: 'Corporate deleted successfully' }
  } catch (error: unknown) {
    logger.error('Delete corporate error', error)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const message = error instanceof Error ? error.message : (error as any)?.message || 'Unknown error'
    return { success: false, message: 'Failed to delete corporate: ' + message }
  }
}
