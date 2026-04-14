'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { auth, db } from '@/lib/firebase/client';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'sonner';

export default function RegisterStaffPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    vehicleNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email.trim().toLowerCase(),
        formData.password
      );

      const user = userCredential.user;

      // Update display name
      await updateProfile(user, {
        displayName: formData.fullName,
      });

      // Create user document in Firestore with delivery_boy role
      await setDoc(doc(db, 'users', user.uid), {
        email: formData.email.trim().toLowerCase(),
        displayName: formData.fullName,
        phone: formData.phone,
        role: 'delivery_boy',
        vehicleNumber: formData.vehicleNumber || '',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      toast.success('Account created successfully! Please login.');
      
      // Sign out and redirect to login
      await auth.signOut();
      router.push('/login');
    } catch (error: any) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Registration failed. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak';
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
              Join Our Delivery Team
            </h1>
            <ul className="space-y-6">
              {[
                'Flexible working hours and schedules.',
                'Earn competitive delivery fees.',
                'Easy-to-use mobile app for deliveries.',
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
              <span className="text-6xl">🚚</span>
            </div>
          </div>
        </section>

        {/* Right Column: Registration Form */}
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
                Staff Registration
              </span>
              <h2 className="font-['Plus_Jakarta_Sans'] text-3xl font-bold text-[#04122e] tracking-tight">
                Create your staff account
              </h2>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <Label htmlFor="fullName" className="text-sm font-semibold text-[#45464d] mb-2 block">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Enter your full name"
                  required
                  disabled={loading}
                  className="w-full bg-white border ring-1 ring-[#c5c6ce] focus:ring-2 focus:ring-[#fea619] rounded-xl px-4 py-3.5"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-semibold text-[#45464d] mb-2 block">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@example.com"
                  required
                  disabled={loading}
                  className="w-full bg-white border ring-1 ring-[#c5c6ce] focus:ring-2 focus:ring-[#fea619] rounded-xl px-4 py-3.5"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm font-semibold text-[#45464d] mb-2 block">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter your phone number"
                  required
                  disabled={loading}
                  className="w-full bg-white border ring-1 ring-[#c5c6ce] focus:ring-2 focus:ring-[#fea619] rounded-xl px-4 py-3.5"
                />
              </div>

              <div>
                <Label htmlFor="vehicleNumber" className="text-sm font-semibold text-[#45464d] mb-2 block">
                  Vehicle Number (Optional)
                </Label>
                <Input
                  id="vehicleNumber"
                  type="text"
                  value={formData.vehicleNumber}
                  onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                  placeholder="e.g. DL01AB1234"
                  disabled={loading}
                  className="w-full bg-white border ring-1 ring-[#c5c6ce] focus:ring-2 focus:ring-[#fea619] rounded-xl px-4 py-3.5"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-sm font-semibold text-[#45464d] mb-2 block">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-semibold text-[#45464d] mb-2 block">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  className="w-full bg-white border ring-1 ring-[#c5c6ce] focus:ring-2 focus:ring-[#fea619] rounded-xl px-4 py-3.5"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-br from-[#04122e] to-[#1a2744] text-white font-['Plus_Jakarta_Sans'] font-bold rounded-xl shadow-lg hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </div>
            </form>

            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-[#45464d] font-medium">
                Already have an account?{' '}
                <Link href="/login" className="text-[#855300] font-bold hover:underline">
                  Sign in
                </Link>
              </p>
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
