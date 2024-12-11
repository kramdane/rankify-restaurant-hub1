import { supabase } from "@/lib/supabase";

export const createTestUser = async () => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'test123',
    });

    if (error) {
      console.error('Error creating test user:', error.message);
      return;
    }

    console.log('Test user created successfully:', data);
  } catch (error) {
    console.error('Error:', error);
  }
};