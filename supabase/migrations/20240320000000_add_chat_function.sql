-- Create a type for message roles if it doesn't exist
DO $$ BEGIN
    CREATE TYPE message_role AS ENUM ('user', 'assistant');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create a messages table to store chat history
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    role message_role NOT NULL,
    content TEXT NOT NULL,
    restaurant_id UUID REFERENCES restaurants(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Drop existing function if it exists to avoid conflicts
DROP FUNCTION IF EXISTS handle_chat(TEXT);
DROP FUNCTION IF EXISTS handle_chat(TEXT, UUID);

-- Create a single handle_chat function with both parameters
CREATE OR REPLACE FUNCTION handle_chat(
    message TEXT,
    restaurant_id UUID DEFAULT NULL
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    response TEXT;
    latest_review RECORD;
BEGIN
    -- Store the user message
    INSERT INTO messages (role, content, restaurant_id)
    VALUES ('user', message, restaurant_id);

    -- Check for review-related queries
    IF message ILIKE '%last review%' OR message ILIKE '%latest review%' OR message ILIKE '%recent review%' THEN
        -- Get the most recent review for the restaurant
        SELECT reviewer_name, rating, comment, created_at
        INTO latest_review
        FROM reviews
        WHERE restaurant_id = $2
        ORDER BY created_at DESC
        LIMIT 1;

        IF FOUND THEN
            response := format(
                'Your latest review was from %s on %s with a rating of %s stars: "%s"',
                latest_review.reviewer_name,
                to_char(latest_review.created_at, 'YYYY-MM-DD'),
                latest_review.rating,
                latest_review.comment
            );
        ELSE
            response := 'I couldn''t find any reviews for your restaurant yet.';
        END IF;
    ELSIF message ILIKE '%review%' THEN
        response := 'I can help you with your reviews. Would you like to see your latest review, review statistics, or analyze review trends?';
    ELSIF message ILIKE '%hello%' OR message ILIKE '%hi%' OR message ILIKE '%hey%' THEN
        response := 'Hello! I''m your restaurant assistant. I can help you with reviews, menu management, and more. What would you like to know?';
    ELSE
        response := 'I understand you said: "' || message || '". Could you please be more specific about what you''d like to know? I can help with reviews, menu items, or general restaurant management.';
    END IF;

    -- Store the assistant response
    INSERT INTO messages (role, content, restaurant_id)
    VALUES ('assistant', response, restaurant_id);

    RETURN response;
END;
$$;

-- Grant necessary permissions
GRANT ALL ON TABLE messages TO anon, authenticated;
GRANT EXECUTE ON FUNCTION handle_chat(TEXT, UUID) TO anon, authenticated;