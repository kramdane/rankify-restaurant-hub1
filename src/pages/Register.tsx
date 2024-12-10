import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // First, sign up the user
      await signUp(email, password);
      
      // Get the user data after signup
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Create a restaurant record for the new user
        const { error: restaurantError } = await supabase
          .from('restaurants')
          .insert([
            {
              user_id: user.id,
              name: 'My Restaurant', // Default name that can be changed later
              email: user.email,
              owner_name: 'Restaurant Owner', // Default name that can be changed later
            }
          ]);

        if (restaurantError) {
          console.error('Error creating restaurant:', restaurantError);
          toast.error('Failed to set up your restaurant profile');
        } else {
          toast.success('Account created successfully!');
        }
      }
      
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Failed to create account');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Enter your email below to create your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full">
              Create account
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate('/login')}
            >
              Already have an account? Sign in
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Register;