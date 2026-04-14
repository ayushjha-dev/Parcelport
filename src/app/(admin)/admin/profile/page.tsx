'use client';

import { TopBar } from '@/components/layout/TopBar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, Save, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function AdminProfilePage() {
  const { user, logout } = useAuth('admin');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    mobile_number: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        mobile_number: user.mobile_number || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call API to update profile
      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.full_name,
          mobile_number: formData.mobile_number,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      setSigningOut(true);
      try {
        await logout();
      } catch (error) {
        console.error('Sign out error:', error);
        toast.error('Failed to sign out');
        setSigningOut(false);
      }
    }
  };

  const profileName = formData.full_name || user?.full_name || '';
  const profileEmail = formData.email || user?.email || '';

  return (
    <div className="min-h-screen">
      <TopBar title="Admin Profile" showSearch={false} />
      
      <div className="pt-28 pb-12 px-10">
        <div className="max-w-4xl mx-auto">
          <Card className="rounded-3xl p-10 shadow-[0px_20px_40px_rgba(4,18,46,0.04)]">
            {/* Profile Header */}
            <div className="flex items-center gap-6 mb-10">
              <div className="w-24 h-24 rounded-full bg-[#04122e] text-white flex items-center justify-center text-3xl font-bold">
                {(profileName || profileEmail || 'A').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#04122e]">{profileName || 'Admin User'}</h2>
                <p className="text-[#45464d]">{profileEmail}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                  ADMIN
                </span>
              </div>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-semibold text-[#45464d]">
                    <User className="w-4 h-4" />
                    Full Name
                  </Label>
                  <Input 
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="Your full name" 
                    className="bg-[#f0f4f8] border-transparent rounded-xl" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-semibold text-[#45464d]">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input 
                    value={formData.email}
                    disabled
                    placeholder="your.email@example.com" 
                    className="bg-[#f0f4f8] border-transparent rounded-xl opacity-60 cursor-not-allowed" 
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="flex items-center gap-2 text-sm font-semibold text-[#45464d]">
                    <Phone className="w-4 h-4" />
                    Mobile Number
                  </Label>
                  <Input 
                    value={formData.mobile_number}
                    onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
                    placeholder="Add your mobile number" 
                    className="bg-[#f0f4f8] border-transparent rounded-xl" 
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-[#eaeef2] flex justify-between items-center">
                <Button 
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-br from-[#04122e] to-[#1a2744] text-white rounded-xl font-bold shadow-xl flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>

                <Button 
                  type="button"
                  onClick={handleSignOut}
                  disabled={signingOut}
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-bold flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  {signingOut ? 'Signing out...' : 'Sign Out'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
