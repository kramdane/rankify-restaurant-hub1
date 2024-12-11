import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const createTestUser = async () => {
  try {
    // First check if the test user already exists
    const { data: existingUser } = await supabase
      .from('auth.users')
      .select('id')
      .eq('email', 'test@example.com')
      .single();

    let userId;

    if (!existingUser) {
      // Create the test user if it doesn't exist
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email: 'test@example.com',
        password: 'test123',
      });

      if (signUpError) throw signUpError;
      if (!user) throw new Error('Failed to create test user');
      
      userId = user.id;
    } else {
      userId = existingUser.id;
    }

    // Call the create_test_data function with the user ID
    const { error: testDataError } = await supabase
      .rpc('create_test_data', { test_user_id: userId });

    if (testDataError) throw testDataError;

    toast.success('Test data created successfully! You can now log in with test@example.com / test123');
    
  } catch (error: any) {
    console.error('Error creating test data:', error);
    toast.error(error.message || 'Failed to create test data');
  }
};