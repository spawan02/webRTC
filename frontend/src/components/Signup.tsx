import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff } from 'lucide-react';
import { useRecoilState } from 'recoil';
import { tokenState } from '@/store/user';
import { useNavigate } from 'react-router-dom';

const SignupForm = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [ token, setToken ] = useRecoilState(tokenState)
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [token, setToken] = useState(null);

  const getToken = async (userId:string) => {
    const response = await fetch(`${import.meta.env.VITE_URL}/token?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    return data.token;
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Basic validation
      if (formData.username.length < 3) {
        throw new Error('Username must be at least 3 characters long');
      }
      
      if (formData.password.length < 2) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Get token using the username as userId
      const userToken = await getToken(formData.username);
      setToken(userToken);
      setSuccess(true);
      console.log(token)
      // You can store the token in localStorage or handle it as needed
      localStorage.setItem('userToken', userToken);
      navigate('/live')
    } catch (err:any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e:any) => {
    
    const { name, value } = e.target;
    setFormData(prev=>({
      ...prev,
        [name]: value
    }))
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
        </CardHeader>
        <CardContent>
          {success ? (
            <Alert className="bg-green-50">
              <AlertDescription className="text-green-700">
                Account created successfully! 
                {token && <div className="mt-2">Token: {token}</div>}
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert className="bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full"
                  placeholder="Enter your username"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupForm;