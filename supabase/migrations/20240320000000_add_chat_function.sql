-- Create the chat handling function
create or replace function handle_chat(message text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  response text;
begin
  -- For now, this is a simple echo response
  -- You can enhance this later with more sophisticated logic
  response := 'I received your message: ' || message;
  return response;
end;
$$;

-- Grant access to the function
grant execute on function handle_chat(text) to anon, authenticated;