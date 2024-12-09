-- Add address column to restaurants table if it doesn't exist
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS address TEXT;

-- Add comment to explain the column usage
COMMENT ON COLUMN restaurants.address IS 'Physical address of the restaurant';