-- Create storage bucket for inspection photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('inspection-photos', 'inspection-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on objects if not already (it usually is)
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policies for inspection-photos
CREATE POLICY "Public Access" ON storage.objects 
  FOR SELECT USING (bucket_id = 'inspection-photos');

CREATE POLICY "Authenticated Upload" ON storage.objects 
  FOR INSERT WITH CHECK (
    bucket_id = 'inspection-photos' 
    AND auth.role() = 'authenticated'
  );
