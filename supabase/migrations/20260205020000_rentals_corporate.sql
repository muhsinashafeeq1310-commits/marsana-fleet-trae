ALTER TABLE rentals 
ADD COLUMN corporate_id UUID REFERENCES corporates(id);
