'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { TopBar } from '@/components/layout/TopBar';
import { auth, db } from '@/lib/firebase/client';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'sonner';

export default function CreateAdminPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
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

    if (!formData.fullName.trim()) {
      toast.error('Full name is required');
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

      // Create user document in Firestore with admin role
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: formData.email.trim().toLowerCase(),
        name: formData.fullName,
        displayName: formData.fullName,
        phone: formData.phone,
        role: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      toast.success('Admin account created successfully!');
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
      });
      
      setLoading(false);
    } catch (error: any) {
      console.error('Admin creation error:', error);
      
      let errorMessage = 'Failed to create admin account';
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
    <div className="min-h-screen">
      <TopBar title="Create New Admin" subtitle="Add a new administrator to the system" showSearch={false} />
      
      <div className="pt-28 pb-12 px-10">
        <div className="max-w-2xl mx-auto">
          <Card className="rounded-xl p-10 shadow-sm">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#ba1a1a]/10 rounded-xl flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-[#ba1a1a]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#04122e]">Create Administrator Account</h2>
                  <p className="text-sm text-[#45464d]">Add a new admin with full system access</p>
                </div>
              </div>
              
              <div className="bg-[#ffdad6]/30 border border-[#ba1a1a]/20 rounded-xl p-4">
                <p className="text-xs text-[#ba1a1a] font-medium">
                  ⚠️ Administrator accounts have full access to all system features. Create responsibly.
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateAdmin} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label className="text-xs font-bold text-[#04122e] uppercase tracking-widest">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Enter full name"
                  required
                  disabled={loading}
                  className="bg-[#f0f4f8] border-transparent rounded-xl"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label className="text-xs font-bold text-[#04122e] uppercase tracking-widest">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="admin@example.com"
                  required
                  disabled={loading}
                  className="bg-[#f0f4f8] border-transparent rounded-xl"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label className="text-xs font-bold text-[#04122e] uppercase tracking-widest">
                  Phone Number (Optional)
                </Label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone number"
                  disabled={loading}
                  className="bg-[#f0f4f8] border-transparent rounded-xl"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label className="text-xs font-bold text-[#04122e] uppercase tracking-widest">
                  Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Minimum 6 characters"
                    required
                    disabled={loading}
                    className="bg-[#f0f4f8] border-transparent rounded-xl pr-12"
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

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label className="text-xs font-bold text-[#04122e] uppercase tracking-widest">
                  Confirm Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Re-enter password"
                    required
                    disabled={loading}
                    className="bg-[#f0f4f8] border-transparent rounded-xl pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#45464d] hover:text-[#04122e]"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-[#eaeef2] flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.push('/admin/dashboard')}
                  disabled={loading}
                  className="font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-br from-[#ba1a1a] to-[#8b0000] text-white rounded-xl font-bold shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Create Admin Account
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
