'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import type { UserRole } from '@/types/database';
import { loginSchema } from '@/lib/validations/auth';

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsedCredentials = loginSchema.safeParse({
      email: email.trim().toLowerCase(),
      password,
    });

    if (!parsedCredentials.success) {
      toast.error(parsedCredentials.error.issues[0]?.message || 'Please enter valid credentials.');
      return;
    }

    setLoading(true);

    try {
      const { email: validEmail, password: validPassword } = parsedCredentials.data;

      // Sign in with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: validEmail,
        password: validPassword,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No user data returned');

      // Get user profile from database
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .single();

      if (profileError || !profile) {
        await supabase.auth.signOut();
        toast.error('User profile not found. Please contact support.');
        setLoading(false);
        return;
      }

      const userRole = profile.role as UserRole;

      // Verify role matches selected role
      if (userRole !== selectedRole) {
        await supabase.auth.signOut();
        toast.error(`This account is not registered as ${selectedRole}. Please select the correct role.`);
        setLoading(false);
        return;
      }

      toast.success('Login successful!');

      // Redirect based on role
      switch (userRole) {
        case 'admin':
          router.push('/admin/dashboard');
          break;
        case 'student':
          router.push('/student/dashboard');
          break;
        case 'delivery_boy':
          router.push('/delivery/dashboard');
          break;
        default:
          router.push('/');
      }
    } catch (error: unknown) {
      console.error('Login error:', error);
      
      let errorMessage = 'Login failed. Please check your credentials.';
      if (error && typeof error === 'object' && 'message' in error) {
        const supabaseError = error as { message: string };
        if (supabaseError.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password.';
        } else if (supabaseError.message.includes('Email not confirmed')) {
          errorMessage = 'Please verify your email address.';
        } else if (supabaseError.message.includes('User not found')) {
          errorMessage = 'No account found with this email.';
        }
      }
      
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6fafe] flex flex-col">
      <main className="flex-grow flex h-full">
        {/* Left Column: Branding */}
        <section className="hidden lg:flex lg:w-[45%] bg-[#1a2744] relative overflow-hidden flex-col justify-between p-16">
          <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay"></div>
          
          {/* Logo */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg">
              <Package2 className="text-[#04122e] w-6 h-6" />
            </div>
            <span className="font-['Plus_Jakarta_Sans'] text-2xl font-extrabold text-white tracking-tighter">
              ParcelPort
            </span>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-md">
            <h1 className="font-['Plus_Jakarta_Sans'] text-4xl font-bold text-white leading-tight mb-8">
              University Parcel Delivery, Simplified.
            </h1>
            <ul className="space-y-6">
              {[
                'Real-time tracking for every campus delivery.',
                'Secure OTP-based pickup for hostel students.',
                'Automated notifications for incoming parcels.',
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-[#fea619] flex items-center justify-center">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <p className="text-[#828eb1] font-medium">{text}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Illustration */}
          <div className="relative z-10 mt-auto">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#04122e]/40 backdrop-blur-md border border-white/10 flex items-center justify-center">
              <Package2 className="w-20 h-20 text-[#fea619] opacity-80" />
            </div>
          </div>
        </section>

        {/* Right Column: Login Form */}
        <section className="w-full lg:w-[55%] bg-[#f6fafe] flex flex-col justify-center px-8 md:px-24 py-12 overflow-y-auto">
          <div className="max-w-md w-full mx-auto">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center gap-3 mb-12">
              <div className="w-8 h-8 bg-[#04122e] rounded-lg flex items-center justify-center">
                <Package2 className="text-white w-5 h-5" />
              </div>
              <span className="font-['Plus_Jakarta_Sans'] text-xl font-extrabold text-[#04122e] tracking-tighter">
                ParcelPort
              </span>
            </div>

            <div className="mb-10">
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#855300] mb-2 block">
                Welcome Back
              </span>
              <h2 className="font-['Plus_Jakarta_Sans'] text-3xl font-bold text-[#04122e] tracking-tight">
                Sign in to your account
              </h2>
            </div>

            {/* Role Selector */}
            <div className="mb-8">
              <Label className="text-sm font-semibold text-[#45464d] mb-4 block">Select your role</Label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'student', label: 'Student', icon: '👤' },
                  { value: 'admin', label: 'Admin', icon: '🛡️' },
                  { value: 'delivery_boy', label: 'Staff', icon: '🚚' },
                ].map((role) => (
                  <button
                    key={role.value}
                    onClick={() => setSelectedRole(role.value as typeof selectedRole)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      selectedRole === role.value
                        ? 'border-[#fea619] bg-[#fea619]/5'
                        : 'border-[#c5c6ce] bg-white hover:bg-[#f0f4f8]'
                    }`}
                  >
                    <span className="text-2xl">{role.icon}</span>
                    <span className="text-xs font-bold text-[#04122e]">{role.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <Label htmlFor="email" className="text-sm font-semibold text-[#45464d] mb-2 block">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  disabled={loading}
                  className="w-full bg-white border ring-1 ring-[#c5c6ce] focus:ring-2 focus:ring-[#fea619] rounded-xl px-4 py-3.5"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor="password" className="text-sm font-semibold text-[#45464d]">
                    Password
                  </Label>
                  <Link href="/forgot-password" className="text-xs font-bold text-[#855300] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    className="w-full bg-white border ring-1 ring-[#c5c6ce] focus:ring-2 focus:ring-[#fea619] rounded-xl px-4 py-3.5"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#45464d] hover:text-[#04122e]"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-br from-[#04122e] to-[#1a2744] text-white font-['Plus_Jakarta_Sans'] font-bold rounded-xl shadow-lg hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </div>
            </form>

            {/* Support Link */}
            <div className="mt-12 text-center">
              {selectedRole === 'student' && (
                <p className="text-sm text-[#45464d] font-medium">
                  New student?{' '}
                  <Link href="/register" className="text-[#855300] font-bold hover:underline">
                    Create an account
                  </Link>
                </p>
              )}
              {selectedRole === 'delivery_boy' && (
                <p className="text-sm text-[#45464d] font-medium">
                  New staff member?{' '}
                  <Link href="/register-staff" className="text-[#855300] font-bold hover:underline">
                    Create an account
                  </Link>
                </p>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#f0f4f8] py-6 px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[10px] tracking-wide uppercase font-bold text-[#45464d]">
          © 2024 ParcelPort Academic Concierge. All rights reserved.
        </p>
        <div className="flex gap-8">
          {['Privacy Policy', 'Terms of Service', 'Support'].map((link) => (
            <Link
              key={link}
              href="#"
              className="text-[10px] tracking-wide uppercase font-bold text-[#45464d] hover:text-[#855300] transition-colors"
            >
              {link}
            </Link>
          ))}
        </div>
      </footer>
    </div>
  );
}
