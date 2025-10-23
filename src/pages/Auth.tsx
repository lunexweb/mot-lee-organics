import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useFormValidation } from '@/hooks/useFormValidation';
import { commonRules } from '@/utils/validation';

export const Auth = () => {
  const { login, register, user } = useApp();
  const navigate = useNavigate();

  // Login form validation
  const loginForm = useFormValidation({
    rules: {
      email: commonRules.email,
      password: { required: true, minLength: 6 }
    },
    onSubmit: async (data) => {
      try {
        await login(data.email, data.password);
        toast.success('Logged in successfully!');
      } catch (error) {
        toast.error('Login failed. Please try again.');
      }
    }
  });

  // Register form validation
  const registerForm = useFormValidation({
    rules: {
      name: commonRules.name,
      email: commonRules.email,
      password: commonRules.password,
      confirmPassword: { required: true }
    },
    onSubmit: async (data) => {
      if (data.password !== data.confirmPassword) {
        registerForm.setFieldError('confirmPassword', 'Passwords do not match');
        return;
      }

      try {
        await register(data.email, data.password, data.name);
        toast.success('Account created successfully!');
      } catch (error) {
        toast.error('Registration failed. Please try again.');
      }
    }
  });

  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 sm:py-16 px-4 sm:px-6">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Sign in to your account or create a new one</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={loginForm.handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="you@example.com"
                        value={loginForm.data.email || ''}
                        onChange={(e) => loginForm.setFieldValue('email', e.target.value)}
                        onBlur={() => loginForm.validateField('email', loginForm.data.email)}
                      />
                      {loginForm.getFieldError('email') && (
                        <p className="text-sm text-red-600 mt-1">{loginForm.getFieldError('email')}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="login-password">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        value={loginForm.data.password || ''}
                        onChange={(e) => loginForm.setFieldValue('password', e.target.value)}
                        onBlur={() => loginForm.validateField('password', loginForm.data.password)}
                      />
                      {loginForm.getFieldError('password') && (
                        <p className="text-sm text-red-600 mt-1">{loginForm.getFieldError('password')}</p>
                      )}
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                      disabled={loginForm.isSubmitting || loginForm.hasErrors}
                    >
                      {loginForm.isSubmitting ? 'Logging in...' : 'Login'}
                    </Button>
                    <div className="mt-6 p-4 bg-muted rounded-lg space-y-2">
                      <p className="text-xs font-semibold text-foreground">Demo Login Credentials:</p>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p><span className="font-medium">Admin:</span> admin@motlee.com</p>
                        <p><span className="font-medium">Customer:</span> customer@demo.com</p>
                        <p className="text-[10px] italic mt-2">Password: any value works</p>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Create Account</CardTitle>
                  <CardDescription>Sign up to start shopping</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={registerForm.handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="register-name">Full Name</Label>
                      <Input
                        id="register-name"
                        placeholder="John Doe"
                        value={registerForm.data.name || ''}
                        onChange={(e) => registerForm.setFieldValue('name', e.target.value)}
                        onBlur={() => registerForm.validateField('name', registerForm.data.name)}
                      />
                      {registerForm.getFieldError('name') && (
                        <p className="text-sm text-red-600 mt-1">{registerForm.getFieldError('name')}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="you@example.com"
                        value={registerForm.data.email || ''}
                        onChange={(e) => registerForm.setFieldValue('email', e.target.value)}
                        onBlur={() => registerForm.validateField('email', registerForm.data.email)}
                      />
                      {registerForm.getFieldError('email') && (
                        <p className="text-sm text-red-600 mt-1">{registerForm.getFieldError('email')}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="register-password">Password</Label>
                      <Input
                        id="register-password"
                        type="password"
                        value={registerForm.data.password || ''}
                        onChange={(e) => registerForm.setFieldValue('password', e.target.value)}
                        onBlur={() => registerForm.validateField('password', registerForm.data.password)}
                      />
                      {registerForm.getFieldError('password') && (
                        <p className="text-sm text-red-600 mt-1">{registerForm.getFieldError('password')}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Must contain uppercase, lowercase, number, and special character
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="register-confirm">Confirm Password</Label>
                      <Input
                        id="register-confirm"
                        type="password"
                        value={registerForm.data.confirmPassword || ''}
                        onChange={(e) => registerForm.setFieldValue('confirmPassword', e.target.value)}
                        onBlur={() => registerForm.validateField('confirmPassword', registerForm.data.confirmPassword)}
                      />
                      {registerForm.getFieldError('confirmPassword') && (
                        <p className="text-sm text-red-600 mt-1">{registerForm.getFieldError('confirmPassword')}</p>
                      )}
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                      disabled={registerForm.isSubmitting || registerForm.hasErrors}
                    >
                      {registerForm.isSubmitting ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
