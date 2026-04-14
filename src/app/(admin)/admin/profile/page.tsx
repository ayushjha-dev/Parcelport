'use client';

import { TopBar } from '@/components/layout/TopBar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, Camera, Save, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase/client';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';

export default function AdminProfilePage() {
  const { user, updateUserProfile, getUserProfile, signOut } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    mobile: '',
    photoURL: '',
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        const profile = await getUserProfile();
        setFormData({
          displayName: user.displayName || '',
          email: user.email || '',
          mobile: profile?.mobile || '',
          photoURL: user.photoURL || '',
        });
      }
    };
    loadProfile();
  }, [user]);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      // Upload to Firebase Storage
      const storageRef = ref(storage, `profile-photos/${user.uid}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);

      // Update Firestore
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { photoURL });

      setFormData({ ...formData, photoURL });
      toast.success('Profile photo updated successfully!');
    } catch (error) {
      console.error('Photo upload error:', error);
      toast.error('Failed to upload photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateUserProfile({
        displayName: formData.displayName,
        mobile: formData.mobile,
      });
      
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
        await signOut();
        router.push('/login');
      } catch (error) {
        console.error('Sign out error:', error);
        toast.error('Failed to sign out');
        setSigningOut(false);
      }
    }
  };

  const profileName = formData.displayName || user?.displayName || '';
  const profileEmail = formData.email || user?.email || '';
  const profilePhoto = formData.photoURL || user?.photoURL || '';

  return (
    <div className="min-h-screen">
      <TopBar title="Admin Profile" showSearch={false} />
      
      <div className="pt-28 pb-12 px-10">
        <div className="max-w-4xl mx-auto">
          <Card className="rounded-3xl p-10 shadow-[0px_20px_40px_rgba(4,18,46,0.04)]">
            {/* Profile Header */}
            <div className="flex items-center gap-6 mb-10">
              <div className="relative">
                {profilePhoto ? (
                  <img 
                    src={profilePhoto} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-[#04122e] text-white flex items-center justify-center text-3xl font-bold">
                    {(profileName || profileEmail || 'A').slice(0, 2).toUpperCase()}
                  </div>
                )}
                <button
                  type="button"
                  onClick={handlePhotoClick}
                  disabled={uploading}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-[#04122e] text-white rounded-full flex items-center justify-center hover:bg-[#1a2744] transition-colors shadow-lg"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
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
                <div className="space-y-2 md:col-span-2">
                  <Label className="flex items-center gap-2 text-sm font-semibold text-[#45464d]">
                    <Phone className="w-4 h-4" />
                    Mobile Number
                  </Label>
                  <Input 
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="Add your mobile number" 
                    className="bg-[#f0f4f8] border-transparent rounded-xl" 
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-[#eaeef2] flex justify-between items-center">
                <Button 
                  type="submit"
                  disabled={loading || uploading}
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
