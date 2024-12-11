import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const createTestUser = async () => {
  try {
    // First create and sign in as the test user
    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'test123',
    });

    if (signUpError) {
      // If user already exists, try to sign in
      if (signUpError.message.includes('already registered')) {
        const { data: { user: existingUser }, error: signInError } = await supabase.auth.signInWithPassword({
          email: 'test@example.com',
          password: 'test123',
        });
        
        if (signInError) throw signInError;
        if (!existingUser) throw new Error('Failed to sign in as test user');
        
        // Call the create_test_data function with the user ID
        const { error: testDataError } = await supabase
          .rpc('create_test_data', { test_user_id: existingUser.id });

        if (testDataError) throw testDataError;
      } else {
        throw signUpError;
      }
    } else {
      if (!user) throw new Error('Failed to create test user');
      
      // Call the create_test_data function with the new user ID
      const { error: testDataError } = await supabase
        .rpc('create_test_data', { test_user_id: user.id });

      if (testDataError) throw testDataError;
    }

    toast.success('Test data created successfully! You can now log in with test@example.com / test123');
    
  } catch (error: any) {
    console.error('Error creating test data:', error);
    toast.error(error.message || 'Failed to create test data');
  }
};