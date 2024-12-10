-- Create a type for message roles
CREATE TYPE message_role AS ENUM ('user', 'assistant');

-- Create a messages table to store chat history
CREATE TABLE IF NOT EXISTS messages (
    id BIGSERIAL PRIMARY KEY,
    role message_role NOT NULL,
    content TEXT NOT NULL,
    restaurant_id BIGINT REFERENCES restaurants(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create the chat handling function with proper business logic
CREATE OR REPLACE FUNCTION handle_chat(
    message TEXT,
    restaurant_id BIGINT DEFAULT NULL
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    response TEXT;
    stored_message_id BIGINT;
BEGIN
    -- Store the user message
    INSERT INTO messages (role, content, restaurant_id)
    VALUES ('user', message, restaurant_id)
    RETURNING id INTO stored_message_id;

    -- Generate response based on the message content
    -- This is a simple example; you can enhance this logic
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
GRANT USAGE ON SEQUENCE messages_id_seq TO anon, authenticated;
GRANT ALL ON TABLE messages TO anon, authenticated;
GRANT EXECUTE ON FUNCTION handle_chat(TEXT, BIGINT) TO anon, authenticated;