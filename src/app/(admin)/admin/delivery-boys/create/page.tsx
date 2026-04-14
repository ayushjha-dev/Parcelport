'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TopBar } from '@/components/layout/TopBar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Eye, EyeOff } from 'lucide-react';
import { auth, db } from '@/lib/firebase/client';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'sonner';

export default function CreateDeliveryBoyPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    vehicleNumber: '',
    licenseNumber: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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
        vehicleNumber: formData.vehicleNumber,
        licenseNumber: formData.licenseNumber,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      toast.success('Delivery boy account created successfully!');
      
      // Sign out the newly created user and redirect
      await auth.signOut();
      router.push('/admin/delivery-boys');
    } catch (error: any) {
      console.error('Account creation error:', error);
      
      let errorMessage = 'Failed to create account';
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
      <TopBar title="Create Delivery Boy Account" subtitle="Add new delivery personnel" showSearch={false} />
      
      <div className="pt-28 pb-12 px-10">
        <div className="max-w-4xl mx-auto">
          <Card className="rounded-xl p-10 shadow-sm">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#04122e] mb-1">New Delivery Boy Account</h2>
              <p className="text-[#45464d] text-sm">Fill in the details to create a new delivery personnel account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-sm font-bold text-[#04122e] uppercase tracking-widest mb-4 pb-2 border-b border-[#eaeef2]">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-[#04122e] uppercase tracking-widest">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Enter full name"
                      required
                      disabled={loading}
                      className="bg-[#f0f4f8] border-transparent rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-[#04122e] uppercase tracking-widest">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Enter phone number"
                      required
                      disabled={loading}
                      className="bg-[#f0f4f8] border-transparent rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Account Credentials */}
              <div>
                <h3 className="text-sm font-bold text-[#04122e] uppercase tracking-widest mb-4 pb-2 border-b border-[#eaeef2]">
                  Account Credentials
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-[#04122e] uppercase tracking-widest">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@example.com"
                      required
                      disabled={loading}
                      className="bg-[#f0f4f8] border-transparent rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-[#04122e] uppercase tracking-widest">
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="••••••••"
                        required
                        disabled={loading}
                        className="bg-[#f0f4f8] border-transparent rounded-xl"
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
                </div>
                <div className="space-y-2 mt-6">
                  <Label className="text-xs font-bold text-[#04122e] uppercase tracking-widest">
                    Confirm Password <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    className="bg-[#f0f4f8] border-transparent rounded-xl"
                  />
                </div>
              </div>

              {/* Vehicle Information */}
              <div>
                <h3 className="text-sm font-bold text-[#04122e] uppercase tracking-widest mb-4 pb-2 border-b border-[#eaeef2]">
                  Vehicle Information (Optional)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-[#04122e] uppercase tracking-widest">
                      Vehicle Number
                    </Label>
                    <Input
                      value={formData.vehicleNumber}
                      onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                      placeholder="e.g. DL01AB1234"
                      disabled={loading}
                      className="bg-[#f0f4f8] border-transparent rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-[#04122e] uppercase tracking-widest">
                      License Number
                    </Label>
                    <Input
                      value={formData.licenseNumber}
                      onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                      placeholder="Enter license number"
                      disabled={loading}
                      className="bg-[#f0f4f8] border-transparent rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#eaeef2] flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.push('/admin/delivery-boys')}
                  disabled={loading}
                  className="font-bold flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-br from-[#04122e] to-[#1a2744] text-white rounded-xl font-bold shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
