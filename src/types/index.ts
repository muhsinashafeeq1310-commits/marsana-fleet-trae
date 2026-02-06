export type UserRole = 'super_admin' | 'hq' | 'branch_admin' | 'driver' | 'tech' | 'corporate_admin';

export type VehicleStatus = 'AVAILABLE' | 'ON_RENT' | 'IN_TRANSIT' | 'PENDING_INSPECTION' | 'MAINTENANCE' | 'ACCIDENT';

export type HandshakeStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';

export type InspectionResult = 'CLEAN' | 'DAMAGE' | 'SERVICE_DUE';

export type InspectionType = 'CHECK_IN' | 'CHECK_OUT' | 'ROUTINE' | 'MAINTENANCE';

export type MaintenancePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type AlertType = 'VEHICLE_ACCIDENT' | 'MAINTENANCE_DUE' | 'INSPECTION_OVERDUE' | 'HANDSHAKE_OVERDUE' | 'RENTAL_OVERDUE' | 'MSA_EXPIRY' | 'SLA_BREACH' | 'SYSTEM';

export type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Branch {
  id: string;
  name: string;
  code: string;
  location: string | null;
  is_active: boolean;
}

export interface Vehicle {
  id: string;
  plate_no: string;
  vin: string | null;
  make: string;
  model: string;
  year: number | null;
  color: string | null;
  mileage: number | null;
  fuel_type: string | null;
  current_status: VehicleStatus;
  current_branch_id: string | null;
  assigned_driver_id: string | null;
  purchase_date: string | null;
  purchase_price: number | null;
  insurance_expiry: string | null;
  registration_expiry: string | null;
  next_service_due: string | null;
  next_service_mileage: number | null;
  notes: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
  version: number;
  
  // Joins
  branches?: Branch | null; // Joined branch data
}

export interface Handshake {
  id: string;
  handshake_ref: string;
  vehicle_id: string;
  from_branch_id: string;
  to_branch_id: string;
  status: HandshakeStatus;
  requested_by: string;
  accepted_by: string | null;
  completed_by: string | null;
  eta: string | null;
  actual_departure_at: string | null;
  actual_arrival_at: string | null;
  rejection_reason: string | null;
  notes: string | null;
  documents: Record<string, unknown>;
  created_at: string;
  updated_at: string;

  // Joins
  vehicles?: {
    id: string;
    plate_no: string;
    make: string;
    model: string;
  } | null;
  from_branch?: Branch | null;
  to_branch?: Branch | null;
}

export interface Inspection {
  id: string;
  vehicle_id: string;
  inspection_type: InspectionType;
  mileage: number;
  result: InspectionResult;
  checklist: Record<string, unknown>;
  notes: string | null;
  photos: string[] | null;
  performed_by: string;
  performed_at: string;
  created_at: string;
  updated_at: string;

  // Joins
  vehicles?: {
    id: string;
    plate_no: string;
    make: string;
    model: string;
  } | null;
  performer?: {
    full_name: string;
    email: string;
  } | null;
}

export interface MaintenanceTicket {
  id: string;
  ticket_ref: string;
  vehicle_id: string;
  title: string;
  description: string | null;
  priority: MaintenancePriority;
  status: string;
  assigned_to: string | null;
  estimated_cost: number | null;
  actual_cost: number | null;
  started_at: string | null;
  completed_at: string | null;
  due_date: string | null;
  related_inspection_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;

  // Joins
  vehicles?: {
    id: string;
    plate_no: string;
    make: string;
    model: string;
  } | null;
  assigned?: {
    full_name: string;
    email: string;
  } | null;
}

export interface Rental {
  id: string;
  contract_no: string;
  vehicle_id: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  customer_id_number: string | null;
  start_at: string;
  end_at: string;
  actual_return_at: string | null;
  start_mileage: number | null;
  end_mileage: number | null;
  start_fuel_level: string | null;
  end_fuel_level: string | null;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'OVERDUE';
  total_amount: number | null;
  deposit_amount: number | null;
  notes: string | null;
  contract_url: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  corporate_id: string | null;

  // Joins
  vehicles?: {
    id: string;
    plate_no: string;
    make: string;
    model: string;
  } | null;
  corporates?: {
    id: string;
    name: string;
  } | null;
}


export interface Corporate {
  id: string;
  name: string;
  contact_person: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  address: string | null;
  msa_start_date: string | null;
  msa_expiry_date: string | null;
  msa_document_url: string | null;
  credit_limit: number | null;
  payment_terms: string | null;
  is_active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  reference_type: string | null;
  reference_id: string | null;
  branch_id: string | null;
  vehicle_id: string | null;
  assigned_to: string | null;
  is_resolved: boolean;
  resolved_at: string | null;
  resolved_by: string | null;
  created_at: string;
  updated_at: string;
}
