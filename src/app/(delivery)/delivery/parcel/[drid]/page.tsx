'use client';

import { TopBar } from '@/components/layout/TopBar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Phone, Package, CheckCircle } from 'lucide-react';

export default function DeliveryParcelDetailsPage() {
  return (
    <div className="min-h-screen">
      <TopBar title="Delivery Details" showSearch={false} />
      
      <div className="pt-28 pb-12 px-10">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Parcel Info */}
          <Card className="p-8 rounded-xl shadow-[0px_20px_40px_rgba(4,18,46,0.04)] border border-[#c5c6ce]/10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-lg bg-[#d9e2ff] flex items-center justify-center">
                <Package className="w-8 h-8 text-[#04122e]" />
              </div>
              <div>
                <p className="font-mono text-lg font-bold text-[#04122e]">No parcel selected</p>
                <p className="text-sm text-[#45464d]">Parcel details will load when a delivery is assigned</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#45464d] mt-0.5" />
                <div>
                  <p className="font-semibold text-[#04122e]">Student name not available</p>
                  <p className="text-sm text-[#45464d]">Hostel and room details will appear here</p>
                  <p className="text-xs text-[#75777e] mt-1">Add parcel assignment data to show delivery address</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#45464d]" />
                <p className="text-sm text-[#45464d]">Phone number not available</p>
              </div>
            </div>
          </Card>

          {/* OTP Verification */}
          <Card className="p-8 rounded-xl shadow-[0px_20px_40px_rgba(4,18,46,0.04)] border border-[#c5c6ce]/10">
            <h3 className="text-lg font-bold text-[#04122e] mb-6">Delivery Confirmation</h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-[#45464d]">Enter OTP from Student</Label>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Input
                      key={i}
                      type="text"
                      maxLength={1}
                      className="w-12 h-12 text-center text-xl font-bold bg-[#f0f4f8] border-transparent rounded-xl"
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-[#45464d]">Delivery Photo (Optional)</Label>
                <div className="border-2 border-dashed border-[#c5c6ce] rounded-xl p-6 text-center">
                  <p className="text-sm text-[#45464d]">Take a photo of delivered parcel</p>
                </div>
              </div>

              <Button className="w-full bg-gradient-to-br from-[#04122e] to-[#1a2744] text-white rounded-xl font-bold py-6 flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Confirm Delivery
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
