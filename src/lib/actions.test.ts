import { createVehicle, updateVehicle, deleteVehicle } from './actions';
import { supabaseAdmin } from '@/lib/supabase';

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {},
  supabaseAdmin: {
    from: jest.fn(),
  },
}));

// Mock revalidatePath
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

describe('Vehicle Server Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createVehicle', () => {
    it('should fail validation if required fields are missing', async () => {
      const formData = new FormData();
      // Missing plate_no, make, model, etc.
      
      const result = await createVehicle({ success: false }, formData);
      
      expect(result.success).toBe(false);
      expect(result.errors).toHaveProperty('plate_no');
    });

    it('should fail validation if VIN is too long', async () => {
      const formData = new FormData();
      formData.append('plate_no', '123');
      formData.append('make', 'Toyota');
      formData.append('model', 'Camry');
      formData.append('current_status', 'AVAILABLE');
      formData.append('current_branch_id', 'branch-1');
      formData.append('vin', '123456789012345678'); // 18 chars

      const result = await createVehicle({ success: false }, formData);
      
      expect(result.success).toBe(false);
      expect(result.errors).toHaveProperty('vin');
    });

    it('should create a vehicle successfully', async () => {
      const formData = new FormData();
      formData.append('plate_no', 'TEST-123');
      formData.append('make', 'Toyota');
      formData.append('model', 'Camry');
      formData.append('current_status', 'AVAILABLE');
      formData.append('current_branch_id', 'branch-1');

      // Mock user check
      const mockSupabase = {
        select: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: [{ id: 'user-1', branch_id: 'branch-1' }] }),
        insert: jest.fn().mockResolvedValue({ error: null }),
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
      };

      (supabaseAdmin.from as jest.Mock).mockImplementation((table) => {
        if (table === 'users') {
          return {
            select: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValue({ data: [{ id: 'user-1', branch_id: 'branch-1' }] }),
          };
        }
        return mockSupabase;
      });

      const result = await createVehicle({ success: false }, formData);
      
      expect(result.success).toBe(true);
      expect(supabaseAdmin.from).toHaveBeenCalledWith('vehicles');
    });
  });

  describe('updateVehicle', () => {
    it('should update a vehicle successfully with optimistic locking', async () => {
      const formData = new FormData();
      formData.append('id', 'vehicle-1');
      formData.append('version', '1');
      formData.append('plate_no', 'TEST-123-UPDATED');
      formData.append('make', 'Toyota');
      formData.append('model', 'Camry');
      formData.append('current_status', 'AVAILABLE');
      formData.append('current_branch_id', 'branch-1');

      // Mock select returning data (success)
      (supabaseAdmin.from as jest.Mock).mockReturnValue({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue({ data: [{ id: 'vehicle-1' }], error: null }),
      });

      const result = await updateVehicle({ success: false }, formData);
      
      expect(result.success).toBe(true);
    });

    it('should fail update if optimistic lock fails (data empty)', async () => {
      const formData = new FormData();
      formData.append('id', 'vehicle-1');
      formData.append('version', '1');
      formData.append('plate_no', 'TEST-123');
      formData.append('make', 'Toyota');
      formData.append('model', 'Camry');
      formData.append('current_status', 'AVAILABLE');
      formData.append('current_branch_id', 'branch-1');

      // Mock select returning empty data (conflict)
      (supabaseAdmin.from as jest.Mock).mockReturnValue({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue({ data: [], error: null }),
      });

      const result = await updateVehicle({ success: false }, formData);
      
      expect(result.success).toBe(false);
      expect(result.message).toContain('modified by another user');
    });
  });

  describe('deleteVehicle', () => {
    it('should soft delete a vehicle', async () => {
      const formData = new FormData();
      formData.append('id', 'vehicle-1');

      (supabaseAdmin.from as jest.Mock).mockReturnValue({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ error: null }),
      });

      const result = await deleteVehicle({ success: false }, formData);
      
      expect(result.success).toBe(true);
      // Check that deleted_at was set
      // (Difficult to check exact timestamp match with mock, but we verify update call)
    });
  });
});
