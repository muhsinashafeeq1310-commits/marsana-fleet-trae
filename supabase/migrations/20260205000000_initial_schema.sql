-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUMS
CREATE TYPE user_role AS ENUM ('super_admin', 'hq', 'branch_admin', 'driver', 'tech', 'corporate_admin');
CREATE TYPE vehicle_status AS ENUM ('AVAILABLE', 'ON_RENT', 'IN_TRANSIT', 'PENDING_INSPECTION', 'MAINTENANCE', 'ACCIDENT');
CREATE TYPE handshake_status AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED');
CREATE TYPE inspection_result AS ENUM ('CLEAN', 'DAMAGE', 'SERVICE_DUE');
CREATE TYPE maintenance_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
CREATE TYPE alert_type AS ENUM ('VEHICLE_ACCIDENT', 'MAINTENANCE_DUE', 'INSPECTION_OVERDUE', 'HANDSHAKE_OVERDUE', 'RENTAL_OVERDUE', 'MSA_EXPIRY', 'SLA_BREACH', 'SYSTEM');
CREATE TYPE alert_severity AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- TABLES

-- Branches
CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  code VARCHAR(10) UNIQUE NOT NULL,
  location VARCHAR(100),
  timezone VARCHAR(50) DEFAULT 'UTC',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(100) NOT NULL,
  role user_role NOT NULL DEFAULT 'driver',
  branch_id UUID REFERENCES branches(id),
  phone VARCHAR(20),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vehicles
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plate_no VARCHAR(20) NOT NULL UNIQUE,
  vin VARCHAR(17) UNIQUE,
  make VARCHAR(50) NOT NULL,
  model VARCHAR(50) NOT NULL,
  year INTEGER,
  color VARCHAR(30),
  mileage INTEGER DEFAULT 0,
  fuel_type VARCHAR(20),
  current_status vehicle_status DEFAULT 'AVAILABLE',
  current_branch_id UUID REFERENCES branches(id),
  assigned_driver_id UUID REFERENCES users(id),
  purchase_date DATE,
  purchase_price DECIMAL(12, 2),
  insurance_expiry DATE,
  registration_expiry DATE,
  next_service_due DATE,
  next_service_mileage INTEGER,
  notes TEXT,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  version INTEGER DEFAULT 1
);

-- Handshakes
CREATE TABLE handshakes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  handshake_ref VARCHAR(20) UNIQUE NOT NULL,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id),
  from_branch_id UUID NOT NULL REFERENCES branches(id),
  to_branch_id UUID NOT NULL REFERENCES branches(id),
  status handshake_status DEFAULT 'PENDING',
  requested_by UUID NOT NULL REFERENCES users(id),
  accepted_by UUID REFERENCES users(id),
  completed_by UUID REFERENCES users(id),
  eta TIMESTAMPTZ,
  actual_departure_at TIMESTAMPTZ,
  actual_arrival_at TIMESTAMPTZ,
  rejection_reason TEXT,
  notes TEXT,
  documents JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inspections
CREATE TABLE inspections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id),
  inspection_type VARCHAR(30) DEFAULT 'RETURN',
  mileage INTEGER NOT NULL,
  result inspection_result NOT NULL,
  checklist JSONB DEFAULT '{}',
  notes TEXT,
  photos JSONB DEFAULT '[]',
  performed_by UUID NOT NULL REFERENCES users(id),
  performed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rentals
CREATE TABLE rentals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_no VARCHAR(50) UNIQUE NOT NULL,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id),
  customer_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(100),
  customer_phone VARCHAR(20),
  customer_id_number VARCHAR(50),
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  actual_return_at TIMESTAMPTZ,
  start_mileage INTEGER,
  end_mileage INTEGER,
  start_fuel_level VARCHAR(10),
  end_fuel_level VARCHAR(10),
  status VARCHAR(20) DEFAULT 'ACTIVE',
  total_amount DECIMAL(12, 2),
  deposit_amount DECIMAL(12, 2),
  notes TEXT,
  contract_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- Maintenance Tickets
CREATE TABLE maintenance_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_ref VARCHAR(20) UNIQUE NOT NULL,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  priority maintenance_priority DEFAULT 'MEDIUM',
  status VARCHAR(20) DEFAULT 'OPEN',
  assigned_to UUID REFERENCES users(id),
  estimated_cost DECIMAL(12, 2),
  actual_cost DECIMAL(12, 2),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  due_date DATE,
  related_inspection_id UUID REFERENCES inspections(id),
  notes TEXT,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alerts
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type alert_type NOT NULL,
  severity alert_severity NOT NULL,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  reference_type VARCHAR(30),
  reference_id UUID,
  branch_id UUID REFERENCES branches(id),
  vehicle_id UUID REFERENCES vehicles(id),
  assigned_to UUID REFERENCES users(id),
  acknowledged_by UUID REFERENCES users(id),
  acknowledged_at TIMESTAMPTZ,
  escalated_to UUID REFERENCES users(id),
  escalated_at TIMESTAMPTZ,
  is_resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES users(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_name VARCHAR(50) NOT NULL,
  record_id UUID NOT NULL,
  action VARCHAR(20) NOT NULL,
  old_data JSONB,
  new_data JSONB,
  changed_by UUID NOT NULL REFERENCES users(id),
  changed_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Telemetry
CREATE TABLE telemetry (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  speed INTEGER,
  heading INTEGER,
  odometer INTEGER
);

-- Corporates
CREATE TABLE corporates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  contact_person VARCHAR(100),
  contact_email VARCHAR(100),
  contact_phone VARCHAR(20),
  address TEXT,
  msa_start_date DATE,
  msa_expiry_date DATE,
  msa_document_url TEXT,
  credit_limit DECIMAL(12, 2),
  payment_terms VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS HELPERS
CREATE OR REPLACE FUNCTION current_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN (SELECT role::TEXT FROM users WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION current_user_branch()
RETURNS UUID AS $$
BEGIN
  RETURN (SELECT branch_id FROM users WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS POLICIES

-- Branches
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "branches_select_all" ON branches FOR SELECT USING (true);
CREATE POLICY "branches_insert_hq" ON branches FOR INSERT WITH CHECK (current_user_role() IN ('super_admin', 'hq'));
CREATE POLICY "branches_update_hq" ON branches FOR UPDATE USING (current_user_role() IN ('super_admin', 'hq'));

-- Vehicles
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "vehicles_select_all" ON vehicles FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "vehicles_insert_hq" ON vehicles FOR INSERT WITH CHECK (current_user_role() IN ('super_admin', 'hq'));
CREATE POLICY "vehicles_update_hq" ON vehicles FOR UPDATE USING (current_user_role() IN ('super_admin', 'hq'));
CREATE POLICY "vehicles_update_branch" ON vehicles FOR UPDATE USING (current_user_role() = 'branch_admin' AND current_branch_id = current_user_branch());

-- Handshakes
ALTER TABLE handshakes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "handshakes_select_all" ON handshakes FOR SELECT USING (true);
CREATE POLICY "handshakes_insert" ON handshakes FOR INSERT WITH CHECK (from_branch_id = current_user_branch() OR current_user_role() IN ('super_admin', 'hq'));
CREATE POLICY "handshakes_update" ON handshakes FOR UPDATE USING (to_branch_id = current_user_branch() OR from_branch_id = current_user_branch() OR current_user_role() IN ('super_admin', 'hq'));

-- Rentals
ALTER TABLE rentals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rentals_select_all" ON rentals FOR SELECT USING (true);
CREATE POLICY "rentals_insert" ON rentals FOR INSERT WITH CHECK (current_user_role() IN ('super_admin', 'hq', 'branch_admin'));
CREATE POLICY "rentals_update" ON rentals FOR UPDATE USING (current_user_role() IN ('super_admin', 'hq', 'branch_admin'));

-- Alerts
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "alerts_select_all" ON alerts FOR SELECT USING (true);
CREATE POLICY "alerts_insert_all" ON alerts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "alerts_update" ON alerts FOR UPDATE USING (branch_id = current_user_branch() OR current_user_role() IN ('super_admin', 'hq'));

-- Inspections
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "inspections_select_all" ON inspections FOR SELECT USING (true);
CREATE POLICY "inspections_insert_all" ON inspections FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
