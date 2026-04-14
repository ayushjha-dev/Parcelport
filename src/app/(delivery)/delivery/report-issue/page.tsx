'use client';

import { useRouter } from 'next/navigation';
import { TopBar } from '@/components/layout/TopBar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Upload } from 'lucide-react';

export default function ReportIssuePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen">
      <TopBar title="Report Delivery Issue" showSearch={false} />
      
      <div className="pt-28 pb-12 px-10">
        <div className="max-w-2xl mx-auto">
          <Card className="p-10 rounded-xl shadow-[0px_20px_40px_rgba(4,18,46,0.04)] border border-[#c5c6ce]/10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#04122e]">Report an Issue</h2>
                <p className="text-sm text-[#45464d]">Parcel reference will appear here once assigned</p>
              </div>
            </div>

            <form className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-[#45464d]">Issue Type</Label>
                <Select>
                  <SelectTrigger className="bg-[#f0f4f8] border-transparent rounded-xl">
                    <SelectValue placeholder="Select issue type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_available">Student Not Available</SelectItem>
                    <SelectItem value="wrong_room">Wrong Room Number</SelectItem>
                    <SelectItem value="not_at_gate">Parcel Not at Gate</SelectItem>
                    <SelectItem value="refused">Student Refused</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-[#45464d]">Description</Label>
                <Textarea 
                  placeholder="Describe the issue in detail..."
                  className="bg-[#f0f4f8] border-transparent rounded-xl min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-[#45464d]">Photo Evidence (Optional)</Label>
                <div className="border-2 border-dashed border-[#c5c6ce] rounded-xl p-6 text-center">
                  <Upload className="w-8 h-8 text-[#45464d] mx-auto mb-2" />
                  <p className="text-sm text-[#45464d]">Upload photo</p>
                </div>
              </div>

              <Button 
                type="button"
                onClick={() => router.push('/delivery/report-issue/success')}
                className="w-full bg-gradient-to-br from-[#04122e] to-[#1a2744] text-white rounded-xl font-bold py-4"
              >
                Submit Report
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
