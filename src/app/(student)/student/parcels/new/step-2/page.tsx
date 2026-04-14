'use client';

import { useRouter } from 'next/navigation';
import { TopBar } from '@/components/layout/TopBar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useParcelRegistrationStore } from '@/stores/parcelRegistrationStore';
import { toast } from 'sonner';

export default function RegisterParcelStep2Page() {
  const router = useRouter();
  const { data: registrationData, updateStep2 } = useParcelRegistrationStore();
  const [formData, setFormData] = useState({
    trackingId: registrationData.trackingId || '',
    courierCompany: registrationData.courierCompany || '',
    description: registrationData.description || '',
    weightRange: registrationData.weightRange || '',
    expectedDate: registrationData.expectedDate || '',
    isFragile: registrationData.isFragile || false,
  });

  const isFormValid = () => {
    return (
      formData.trackingId.trim() !== '' &&
      formData.courierCompany !== '' &&
      formData.description.trim() !== '' &&
      formData.expectedDate !== ''
    );
  };

  const handleContinue = () => {
    if (!formData.trackingId.trim()) {
      toast.error('Please enter the parcel tracking ID');
      return;
    }
    if (!formData.courierCompany) {
      toast.error('Please select the courier company');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Please enter a parcel description');
      return;
    }
    if (!formData.expectedDate) {
      toast.error('Please select the expected arrival date');
      return;
    }

    // Save data to store
    updateStep2(formData);
    router.push('/student/parcels/new/step-3');
  };

  return (
    <div className="min-h-screen bg-[#f6fafe]">
      <TopBar title="Register New Parcel" subtitle="Step 2 of 4" showSearch={false} />
      
      <div className="pt-24 px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="rounded-xl p-10 shadow-sm">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#04122e] mb-1">Step 2 — Parcel Information</h2>
              <p className="text-[#45464d] text-sm">Tell us about your incoming parcel</p>
            </div>

            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-[#04122e] uppercase tracking-widest">
                    Parcel AWB / Tracking ID <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    value={formData.trackingId}
                    onChange={(e) => setFormData({ ...formData, trackingId: e.target.value })}
                    placeholder="e.g. 1234567890" 
                    className="bg-[#f0f4f8] border-transparent rounded-xl" 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-[#04122e] uppercase tracking-widest">
                    Courier Company <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    value={formData.courierCompany}
                    onValueChange={(value) => setFormData({ ...formData, courierCompany: value })}
                    required
                  >
                    <SelectTrigger className="bg-[#f0f4f8] border-transparent rounded-xl">
                      <SelectValue placeholder="Select courier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="amazon">Amazon Logistics</SelectItem>
                      <SelectItem value="flipkart">Flipkart/Ekart</SelectItem>
                      <SelectItem value="bluedart">Blue Dart</SelectItem>
                      <SelectItem value="delhivery">Delhivery</SelectItem>
                      <SelectItem value="dtdc">DTDC</SelectItem>
                      <SelectItem value="speedpost">India Post / Speed Post</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-[#04122e] uppercase tracking-widest">
                  Parcel Description <span className="text-red-500">*</span>
                </Label>
                <Textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Laptop bag, Books, Electronics" 
                  className="bg-[#f0f4f8] border-transparent rounded-xl" 
                  rows={3} 
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-[#04122e] uppercase tracking-widest">Weight Range (Optional)</Label>
                  <Select 
                    value={formData.weightRange}
                    onValueChange={(value) => setFormData({ ...formData, weightRange: value })}
                  >
                    <SelectTrigger className="bg-[#f0f4f8] border-transparent rounded-xl">
                      <SelectValue placeholder="Select weight" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under_1kg">Under 1 kg</SelectItem>
                      <SelectItem value="1_to_5kg">1 - 5 kg</SelectItem>
                      <SelectItem value="5_to_10kg">5 - 10 kg</SelectItem>
                      <SelectItem value="over_10kg">Over 10 kg</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-[#04122e] uppercase tracking-widest">
                    Expected Arrival Date <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    type="date" 
                    value={formData.expectedDate}
                    onChange={(e) => setFormData({ ...formData, expectedDate: e.target.value })}
                    className="bg-[#f0f4f8] border-transparent rounded-xl" 
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={formData.isFragile}
                  onChange={(e) => setFormData({ ...formData, isFragile: e.target.checked })}
                  className="w-5 h-5 rounded border-[#c5c6ce] text-[#04122e]" 
                />
                <Label className="text-sm font-medium text-[#45464d]">This parcel is fragile (handle with care)</Label>
              </div>

              <div className="pt-6 border-t border-[#eaeef2] flex items-center justify-between">
                <Button 
                  type="button" 
                  variant="ghost"
                  onClick={() => router.push('/student/parcels/new/step-1')}
                  className="font-bold flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <Button 
                  type="button"
                  onClick={handleContinue}
                  disabled={!isFormValid()}
                  className="bg-gradient-to-br from-[#04122e] to-[#1a2744] text-white rounded-xl font-bold shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Time Slot
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
