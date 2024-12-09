-- Create an enum for review sources
CREATE TYPE review_source AS ENUM ('form', 'google', 'facebook', 'tripadvisor');

-- Add source column to reviews table with default value 'form'
ALTER TABLE reviews 
ADD COLUMN source review_source NOT NULL DEFAULT 'form';

-- Add an index on source for better query performance
CREATE INDEX idx_reviews_source ON reviews(source);