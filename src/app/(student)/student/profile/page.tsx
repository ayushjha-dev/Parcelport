'use client';

import { TopBar } from '@/components/layout/TopBar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, MapPin, Save } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user, updateUserProfile, getUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    mobile: '',
    room: '',
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        const profile = await getUserProfile();
        setFormData({
          displayName: user.displayName || '',
          email: user.email || '',
          mobile: profile?.mobile || '',
          room: profile?.room || '',
        });
      }
    };
    loadProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateUserProfile({
        displayName: formData.displayName,
        mobile: formData.mobile,
        room: formData.room,
      });
      
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const profileName = formData.displayName || user?.displayName || '';
  const profileEmail = formData.email || user?.email || '';

  return (
    <div className="min-h-screen">
      <TopBar title="Profile Settings" showSearch={false} />
      
      <div className="pt-28 pb-12 px-10">
        <div className="max-w-4xl mx-auto">
          <Card className="rounded-3xl p-10 shadow-[0px_20px_40px_rgba(4,18,46,0.04)]">
            <div className="flex items-center gap-6 mb-10">
              <div className="w-24 h-24 rounded-full bg-[#04122e] text-white flex items-center justify-center text-3xl font-bold">
                {(profileName || profileEmail || 'U').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#04122e]">{profileName || 'Profile details not set'}</h2>
                <p className="text-[#45464d]">{profileEmail || 'Add your email in Firebase Authentication'}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-semibold text-[#45464d]">
                    <User className="w-4 h-4" />
                    Full Name
                  </Label>
                  <Input 
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
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
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-semibold text-[#45464d]">
                    <Phone className="w-4 h-4" />
                    Mobile
                  </Label>
                  <Input 
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="Add your mobile number" 
                    className="bg-[#f0f4f8] border-transparent rounded-xl" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-semibold text-[#45464d]">
                    <MapPin className="w-4 h-4" />
                    Room
                  </Label>
                  <Input 
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    placeholder="Add your hostel room" 
                    className="bg-[#f0f4f8] border-transparent rounded-xl" 
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-[#eaeef2]">
                <Button 
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-br from-[#04122e] to-[#1a2744] text-white rounded-xl font-bold shadow-xl flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
