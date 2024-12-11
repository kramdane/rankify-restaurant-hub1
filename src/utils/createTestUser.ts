import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const TEST_USER_ID = "7eada6cb-238a-4267-8057-cde173ef48e8";

export const createTestUser = async () => {
  try {
    // Sign in as the test user
    const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'test123',
    });
    
    if (signInError) throw signInError;
    if (!user) throw new Error('Failed to sign in as test user');
    
    // Check if restaurant already exists for this user
    const { data: existingRestaurant, error: checkError } = await supabase
      .from('restaurants')
      .select('id')
      .eq('user_id', TEST_USER_ID)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (existingRestaurant) {
      // If restaurant exists, just create new reviews
      const { error: testDataError } = await supabase
        .rpc('create_test_data', { test_user_id: TEST_USER_ID });

      if (testDataError) throw testDataError;
    } else {
      // If no restaurant exists, create everything
      const { error: testDataError } = await supabase
        .rpc('create_test_data', { test_user_id: TEST_USER_ID });

      if (testDataError) throw testDataError;
    }

    toast.success('Test data created successfully! You can now log in with test@example.com / test123');
    
  } catch (error: any) {
    console.error('Error creating test data:', error);
    toast.error(error.message || 'Failed to create test data');
  }
};