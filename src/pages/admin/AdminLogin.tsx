import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { useAuth } from '@context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface AdminLoginProps {
  onBack: () => void;
}

export function AdminLogin({ onBack }: AdminLoginProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const navigate = useNavigate();
  const { login, isAdmin, user } = useAuth();

  useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin');
    }
  }, [user, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      await login(formData.email, formData.password);
      // Navigation will be handled by the useEffect above
    } catch (error) {
      setErrors({ 
        general: (error as Error).message || 'Invalid credentials'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 p-0 h-auto text-slate-600 hover:text-slate-900"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Main Site
        </Button>

        <Card className="shadow-lg border-2 border-slate-200 rounded-xl">
          <CardHeader className="text-center pb-6 border-b-2 border-slate-100">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <img src="/nabus-motors-logo.png" alt="Nabus Motors" className="w-20 h-20 object-contain" />
            </div>
            
            <CardTitle className="text-2xl font-bold text-[#001F3F]">
              Nabus Motors Admin
            </CardTitle>
            <p className="text-slate-600 mt-2">
              Sign in to access the admin panel
            </p>
          </CardHeader>
          
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {errors.general}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="admin@nabusmotors.com"
                  className={`border rounded-lg transition-all ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-slate-300 focus:border-[#FFD700]'}`}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter your password"
                  className={`border rounded-lg transition-all ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-slate-300 focus:border-[#FFD700]'}`}
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-[#FFD700] hover:bg-[#FFC700] text-[#001F3F] font-bold uppercase tracking-wide transition-all h-12 rounded-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-[#001F3F]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>

              {/* Forgot Password Link */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  className="text-sm text-[#FFD700] hover:text-[#FFC700] hover:underline font-medium"
                  disabled={isLoading}
                >
                  Forgot your password?
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Demo Credentials Note */}
        <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
          <p className="text-sm text-blue-900 font-bold mb-1">Demo Credentials:</p>
          <p className="text-xs text-blue-800">
            Email: admin@nabusmotors.com<br />
            Password: admin123
          </p>
        </div>
      </div>
    </div>
  );
}
