'use client';

import { useRouter } from 'next/navigation';
import { TopBar } from '@/components/layout/TopBar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Info, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { useParcelRegistrationStore } from '@/stores/parcelRegistrationStore';

export default function RegisterParcelStep1Page() {
  const router = useRouter();
  const { user } = useAuth('student');
  const { data: registrationData, updateStep1 } = useParcelRegistrationStore();
  const [profileData, setProfileData] = useState<any>(null);
  const [formData, setFormData] = useState({
    fullName: registrationData.fullName || '',
    email: registrationData.email || '',
    mobile: registrationData.mobile || '',
    hostelBlock: registrationData.hostelBlock || 'b',
    floorNumber: registrationData.floorNumber || '3',
    roomNumber: registrationData.roomNumber || '',
    landmark: registrationData.landmark || '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.full_name || user.email || '',
        email: user.email || '',
        mobile: user.mobile_number || '',
        hostelBlock: user.hostel_block || 'b',
        floorNumber: user.floor_number || '3',
        roomNumber: user.room_number || '',
        landmark: user.landmark_note || '',
      });
    }
  }, [user]);

  const steps = [
    { num: 1, label: 'Personal Info', active: true },
    { num: 2, label: 'Parcel Info', active: false },
    { num: 3, label: 'Slot Select', active: false },
    { num: 4, label: 'Payment', active: false },
  ];

  const isFormValid = () => {
    return (
      formData.fullName.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.mobile.trim() !== '' &&
      formData.hostelBlock !== '' &&
      formData.floorNumber !== '' &&
      formData.roomNumber.trim() !== ''
    );
  };

  const handleContinue = () => {
    if (isFormValid()) {
      // Save data to store
      updateStep1(formData);
      router.push('/student/parcels/new/step-2');
    } else {
      alert('Please fill in all required fields before continuing.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f6fafe]">
      <TopBar title="Register New Parcel" showSearch={false} />
      
      <div className="pt-24 px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#45464d] font-medium mb-6">
          <span>My Parcels</span>
          <span>›</span>
          <span className="text-[#04122e] font-bold">Register New Parcel</span>
        </nav>

        <div className="grid grid-cols-12 gap-8">
          {/* Form */}
          <div className="col-span-12 lg:col-span-8">
            <Card className="rounded-xl p-10 shadow-sm">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#04122e] mb-1">Step 1 — Personal Information</h2>
                <p className="text-[#45464d] text-sm">Verify your details. Most fields are pre-filled from your profile.</p>
              </div>

              <form className="space-y-8">
                {/* Student Details */}
                <div>
                  <h3 className="text-sm font-bold text-[#04122e] uppercase tracking-widest mb-4 pb-2 border-b border-[#eaeef2]">Student Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-[#04122e] uppercase tracking-widest">
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <Input 
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Your full name" 
                        className="bg-[#f0f4f8] border-transparent rounded-xl" 
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-[#04122e] uppercase tracking-widest">
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input 
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="your.email@example.com" 
                          className="bg-[#f0f4f8] border-transparent rounded-xl" 
                          required
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-lg text-[10px] font-bold uppercase">
                          <CheckCircle className="w-3 h-3" />
                          Verified
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mt-6">
                    <Label className="text-xs font-bold text-[#04122e] uppercase tracking-widest">
                      Mobile Number <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input 
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        placeholder="Add your mobile number" 
                        className="bg-[#f0f4f8] border-transparent rounded-xl" 
                        required
                      />
                      {formData.mobile && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-lg text-[10px] font-bold uppercase">
                          <CheckCircle className="w-3 h-3" />
                          Verified
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Hostel Details */}
                <div>
                  <h3 className="text-sm font-bold text-[#04122e] uppercase tracking-widest mb-4 pb-2 border-b border-[#eaeef2]">Hostel Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-[#04122e] uppercase tracking-widest">
                        Hostel Block <span className="text-red-500">*</span>
                      </Label>
                      <Select 
                        value={formData.hostelBlock}
                        onValueChange={(value) => setFormData({ ...formData, hostelBlock: value })}
                        required
                      >
                        <SelectTrigger className="bg-[#f0f4f8] border-transparent rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="a">Block A</SelectItem>
                          <SelectItem value="b">Block B</SelectItem>
                          <SelectItem value="c">Block C</SelectItem>
                          <SelectItem value="d">Block D</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-[#04122e] uppercase tracking-widest">
                        Floor Number <span className="text-red-500">*</span>
                      </Label>
                      <Select 
                        value={formData.floorNumber}
                        onValueChange={(value) => setFormData({ ...formData, floorNumber: value })}
                        required
                      >
                        <SelectTrigger className="bg-[#f0f4f8] border-transparent rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="g">Ground Floor</SelectItem>
                          <SelectItem value="1">1st Floor</SelectItem>
                          <SelectItem value="2">2nd Floor</SelectItem>
                          <SelectItem value="3">3rd Floor</SelectItem>
                          <SelectItem value="4">4th Floor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-[#04122e] uppercase tracking-widest">
                        Room Number <span className="text-red-500">*</span>
                      </Label>
                      <Input 
                        value={formData.roomNumber}
                        onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                        placeholder="Enter your room number" 
                        className="bg-[#f0f4f8] border-transparent rounded-xl" 
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mt-6">
                    <Label className="text-xs font-bold text-[#04122e] uppercase tracking-widest">Landmark/Note (Optional)</Label>
                    <Input 
                      value={formData.landmark}
                      onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                      placeholder="Near water cooler / Last room on right" 
                      className="bg-[#f0f4f8] border-transparent rounded-xl" 
                    />
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-[#d9e2ff]/30 rounded-xl">
                  <Info className="text-[#1a2744] mt-0.5 w-5 h-5" />
                  <div className="text-sm text-[#3a4665] leading-relaxed">
                    <span className="font-bold">Info:</span> Your details are pre-filled from your profile to ensure delivery reaches the correct student. If you need to update your contact info, visit the <a href="/student/profile" className="underline font-bold">Profile Settings</a>.
                  </div>
                </div>

                <div className="pt-6 border-t border-[#eaeef2] flex items-center justify-between">
                  <Button type="button" variant="ghost" className="font-bold text-[#45464d]">
                    Cancel
                  </Button>
                  <Button 
                    type="button"
                    onClick={handleContinue}
                    disabled={!isFormValid()}
                    className="bg-gradient-to-br from-[#04122e] to-[#1a2744] text-white rounded-xl font-bold shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to Parcel Info
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <Card className="bg-[#f0f4f8] rounded-xl p-6">
              <h3 className="text-[#04122e] font-bold mb-3 flex items-center gap-2">
                ❓ Why we need this
              </h3>
              <p className="text-[#45464d] text-sm leading-relaxed mb-4">
                To maintain the safety and integrity of the hostel premises, we verify all deliveries against official student records. This ensures your parcel never ends up in the wrong hands.
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-[#1a2744]">
                <CheckCircle className="w-4 h-4" />
                Identity Verified via Portal
              </div>
            </Card>

            <Card className="bg-[#ffddb8]/40 border border-[#ffddb8] rounded-xl p-8">
              <div className="flex flex-col gap-1 mb-6">
                <span className="text-xs font-bold text-[#653e00] uppercase tracking-widest">Service Fee</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-[#04122e]">₹10</span>
                  <span className="text-[#45464d] font-medium">/ delivery</span>
                </div>
                <span className="text-xs font-bold text-[#855300]">Flat fee for doorstep delivery</span>
              </div>
              <div className="space-y-4">
                <div className="text-[10px] font-bold text-[#45464d] uppercase tracking-widest border-b border-[#855300]/20 pb-2">
                  Accepted Payments
                </div>
                <div className="flex flex-wrap gap-4 items-center">
                  {['UPI', 'CARDS', 'NETBANK'].map((method) => (
                    <div key={method} className="flex flex-col items-center gap-1 opacity-80 hover:opacity-100 transition-opacity">
                      <div className="w-8 h-8 bg-[#04122e]/10 rounded-lg flex items-center justify-center text-[#04122e] text-xs font-bold">
                        {method[0]}
                      </div>
                      <span className="text-[9px] font-bold text-[#1a2744]">{method}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
