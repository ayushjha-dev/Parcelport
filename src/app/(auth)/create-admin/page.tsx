'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function CreateAdminPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreateAdmin = async (e: React.FormEvent) => {
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
      const response = await fetch('/api/auth/create-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create admin account');
      }

      toast.success('Admin account created successfully!');
      router.push('/login');
    } catch (error: any) {
      console.error('Admin creation error:', error);
      toast.error(error.message || 'Failed to create admin account');
    } finally {
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
              Admin Account Creation
            </h1>
            <p className="text-[#828eb1] font-medium text-lg">
              Create a new administrator account with full system access and management capabilities.
            </p>
          </div>

          {/* Illustration */}
          <div className="relative z-10 mt-auto">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#04122e]/40 backdrop-blur-md border border-white/10 flex items-center justify-center">
              <div className="text-6xl">🛡️</div>
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
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#ba1a1a] mb-2 block">
                Administrator
              </span>
              <h2 className="font-['Plus_Jakarta_Sans'] text-3xl font-bold text-[#04122e] tracking-tight">
                Create Admin Account
              </h2>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleCreateAdmin} className="space-y-6">
              <div>
                <Label htmlFor="fullName" className="text-sm font-semibold text-[#45464d] mb-2 block">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Enter full name"
                  required
                  disabled={loading}
                  className="w-full bg-white border ring-1 ring-[#c5c6ce] focus:ring-2 focus:ring-[#ba1a1a] rounded-xl px-4 py-3.5"
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
                  placeholder="admin@example.com"
                  required
                  disabled={loading}
                  className="w-full bg-white border ring-1 ring-[#c5c6ce] focus:ring-2 focus:ring-[#ba1a1a] rounded-xl px-4 py-3.5"
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
                    className="w-full bg-white border ring-1 ring-[#c5c6ce] focus:ring-2 focus:ring-[#ba1a1a] rounded-xl px-4 py-3.5"
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
                  className="w-full bg-white border ring-1 ring-[#c5c6ce] focus:ring-2 focus:ring-[#ba1a1a] rounded-xl px-4 py-3.5"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-br from-[#ba1a1a] to-[#8b0000] text-white font-['Plus_Jakarta_Sans'] font-bold rounded-xl shadow-lg hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating Admin...' : 'Create Admin Account'}
                </Button>
              </div>
            </form>

            {/* Info */}
            <div className="mt-8 p-4 bg-[#ffdad6]/30 border border-[#ba1a1a]/20 rounded-xl">
              <p className="text-xs text-[#ba1a1a] font-medium">
                ⚠️ This page creates an administrator account with full system access. Use responsibly.
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
      </footer>
    </div>
  );
}
