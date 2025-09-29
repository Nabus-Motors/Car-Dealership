import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function AdminFloatingButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, isAdmin, login, logout } = useAuth();
  const navigate = useNavigate();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      setIsOpen(false);
      setEmail('');
      setPassword('');
      navigate('/admin');
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setError('');
    setEmail('');
    setPassword('');
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 left-6 z-[99998]">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="icon"
          className="h-12 w-12 rounded-full !bg-gray-800 !hover:bg-gray-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          aria-label={user ? "Admin Settings" : "Admin Login"}
        >
          <Settings className="h-6 w-6" />
        </Button>
      </div>

      {/* Modal Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 flex items-center justify-center"
          style={{
            zIndex: 2147483647, // Maximum z-index value
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(4px)'
          }}
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 cursor-pointer"
            onClick={closeModal}
            style={{
              zIndex: 2147483646,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0
            }}
          />
          
          {/* Modal Content */}
          <div 
            className="relative w-full max-w-md mx-4"
            style={{
              zIndex: 2147483647,
              position: 'relative'
            }}
          >
            <Card className="bg-white shadow-2xl border-0 rounded-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-gray-800">
                    {user && isAdmin ? 'Admin Panel' : 'Admin Access'}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={closeModal}
                    className="h-10 w-10 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
                  >
                    <span className="text-2xl font-light">×</span>
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {user && isAdmin ? (
                  // Admin is logged in - show admin options
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">Welcome back, Admin</p>
                      <p className="text-xs text-gray-600 truncate mt-1">
                        {user.email}
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <Button
                        onClick={() => {
                          navigate('/admin');
                          setIsOpen(false);
                        }}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-medium"
                      >
                        Open Dashboard
                      </Button>
                      <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                      >
                        Sign Out
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Show login form
                  <div className="space-y-4">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="admin-email" className="text-sm font-medium">
                          Email Address
                        </Label>
                        <Input
                          id="admin-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="admin@nabusmotors.com"
                          className="h-10"
                          required
                          disabled={loading}
                          autoComplete="email"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="admin-password" className="text-sm font-medium">
                          Password
                        </Label>
                        <Input
                          id="admin-password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="h-10"
                          required
                          disabled={loading}
                          autoComplete="current-password"
                        />
                      </div>

                      {error && (
                        <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-md">
                          {error}
                        </div>
                      )}

                      <div className="flex gap-4 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={closeModal}
                          className="flex-1 h-11 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                          disabled={loading}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white font-medium"
                          disabled={loading || !email.trim() || !password.trim()}
                        >
                          {loading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Signing in...
                            </>
                          ) : (
                            'Sign In'
                          )}
                        </Button>
                      </div>
                    </form>
                    
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500 text-center">
                        Admin access is restricted to authorized personnel only.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}