-- Create a type for message roles
CREATE TYPE message_role AS ENUM ('user', 'assistant');

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
    stored_message_id UUID;
BEGIN
    -- Store the user message
    INSERT INTO messages (role, content, restaurant_id)
    VALUES ('user', message, restaurant_id)
    RETURNING id INTO stored_message_id;

    -- Generate response based on the message content
    IF message ILIKE '%review%' THEN
        response := 'I can help you manage your reviews. Would you like to see recent reviews or analyze review trends?';
    ELSIF message ILIKE '%menu%' THEN
        response := 'I can help you with menu management. Would you like to update your menu items or check current offerings?';
    ELSIF message ILIKE '%hello%' OR message ILIKE '%hi%' THEN
        response := 'Hello! How can I assist you with your restaurant management today?';
    ELSE
        response := 'I understand you said: "' || message || '". How can I help you with that?';
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