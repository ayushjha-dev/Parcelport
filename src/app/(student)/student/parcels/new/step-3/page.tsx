'use client';

import { useRouter } from 'next/navigation';
import { TopBar } from '@/components/layout/TopBar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowRight, ArrowLeft, Clock } from 'lucide-react';
import { useState } from 'react';

export default function RegisterParcelStep3Page() {
  const router = useRouter();
  const [selectedSlot, setSelectedSlot] = useState('');

  const timeSlots = [
    { value: 'morning', label: 'Morning', time: '8:00 AM - 12:00 PM', icon: '🌅' },
    { value: 'afternoon', label: 'Afternoon', time: '12:00 PM - 4:00 PM', icon: '☀️' },
    { value: 'evening', label: 'Evening', time: '4:00 PM - 8:00 PM', icon: '🌆' },
  ];

  const isFormValid = () => {
    return selectedSlot !== '';
  };

  const handleContinue = () => {
    if (isFormValid()) {
      router.push('/student/parcels/new/step-4');
    } else {
      alert('Please select a time slot before continuing.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f6fafe]">
      <TopBar title="Register New Parcel" subtitle="Step 3 of 4" showSearch={false} />
      
      <div className="pt-24 px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="rounded-xl p-10 shadow-sm">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#04122e] mb-1">Step 3 — Preferred Delivery Time</h2>
              <p className="text-[#45464d] text-sm">When would you like to receive your parcel?</p>
            </div>

            <form className="space-y-8">
              <div className="space-y-4">
                <Label className="text-xs font-bold text-[#04122e] uppercase tracking-widest">
                  Select Time Slot <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.value}
                      type="button"
                      onClick={() => setSelectedSlot(slot.value)}
                      className={`p-6 border-2 rounded-xl transition-all hover:shadow-lg group ${
                        selectedSlot === slot.value
                          ? 'border-[#04122e] bg-[#04122e]/5'
                          : 'border-[#c5c6ce] hover:border-[#04122e]'
                      }`}
                    >
                      <div className="text-4xl mb-3">{slot.icon}</div>
                      <h3 className="font-bold text-[#04122e] mb-1">{slot.label}</h3>
                      <p className="text-sm text-[#45464d] flex items-center gap-2 justify-center">
                        <Clock className="w-4 h-4" />
                        {slot.time}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#d9e2ff]/30 border border-[#d9e2ff] rounded-xl p-5">
                <p className="text-sm text-[#3a4665] leading-relaxed">
                  <span className="font-bold">Note:</span> Delivery times are approximate and depend on delivery boy availability. You&apos;ll receive a notification when your parcel is out for delivery.
                </p>
              </div>

              <div className="pt-6 border-t border-[#eaeef2] flex items-center justify-between">
                <Button 
                  type="button" 
                  variant="ghost"
                  onClick={() => router.push('/student/parcels/new/step-2')}
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
                  Continue to Payment
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
