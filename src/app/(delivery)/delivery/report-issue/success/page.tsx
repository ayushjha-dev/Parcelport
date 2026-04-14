'use client';

import Link from 'next/link';
import { TopBar } from '@/components/layout/TopBar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function IssueReportedSuccessPage() {
  return (
    <div className="min-h-screen">
      <TopBar title="Issue Reported" showSearch={false} />
      
      <div className="pt-28 pb-12 px-10">
        <div className="max-w-2xl mx-auto">
          <Card className="p-10 rounded-xl shadow-[0px_20px_40px_rgba(4,18,46,0.04)] border border-[#c5c6ce]/10 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-[#04122e] mb-2">Issue Reported Successfully</h2>
            <p className="text-[#45464d] mb-8">
              Your report has been submitted. The admin team will review and take appropriate action.
            </p>

            <div className="bg-[#f0f4f8] rounded-xl p-6 mb-8">
              <p className="text-sm text-[#45464d] mb-2">Reference Number</p>
              <p className="text-xl font-mono font-bold text-[#04122e]">ISSUE-YYYYMMDD-0001</p>
            </div>

            <Link href="/delivery/dashboard">
              <Button className="w-full bg-gradient-to-br from-[#04122e] to-[#1a2744] text-white rounded-xl font-bold py-4">
                Back to Dashboard
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
