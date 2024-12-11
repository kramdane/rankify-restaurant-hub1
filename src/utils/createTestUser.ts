import { supabase } from "@/lib/supabase";

export const createTestUser = async () => {
  try {
    // First, check if the test user already exists
    const { data: existingUser } = await supabase
      .from('restaurants')
      .select('user_id')
      .eq('email', 'test@example.com')
      .single();

    if (existingUser) {
      console.log('Test user already exists');
      return;
    }

    // Create the test user in auth
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'test123',
    });

    if (signUpError) {
      console.error('Error creating test user:', signUpError.message);
      return;
    }

    if (!authData.user?.id) {
      console.error('No user ID returned from signup');
      return;
    }

    // Call the database function to create test data
    const { error: dbError } = await supabase
      .rpc('create_test_data', {
        test_user_id: authData.user.id
      });

    if (dbError) {
      console.error('Error creating test data:', dbError.message);
      return;
    }

    console.log('Test user and data created successfully');
  } catch (error) {
    console.error('Error:', error);
  }
};