-- Add new columns to restaurants table
ALTER TABLE restaurants
ADD COLUMN IF NOT EXISTS business_hours JSONB,
ADD COLUMN IF NOT EXISTS facebook_url TEXT,
ADD COLUMN IF NOT EXISTS google_business_url TEXT,
ADD COLUMN IF NOT EXISTS tripadvisor_url TEXT;

-- Add comment to explain the business_hours JSONB structure
COMMENT ON COLUMN restaurants.business_hours IS 'Store business hours in format: 
{
  "monday": {"open": "09:00", "close": "22:00"},
  "tuesday": {"open": "09:00", "close": "22:00"},
  ...
}';