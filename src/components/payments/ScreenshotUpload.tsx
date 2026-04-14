'use client';

import { FileUpload } from '@/components/shared/FileUpload';

interface ScreenshotUploadProps {
  onUpload: (url: string) => void;
}

export function ScreenshotUpload({ onUpload }: ScreenshotUploadProps) {
  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-sm text-amber-800">
          Upload a screenshot of your payment confirmation. Admin will verify and approve
          your payment.
        </p>
      </div>
      <FileUpload
        onUpload={onUpload}
        accept="image/*"
        maxSize={5 * 1024 * 1024}
        bucket="payment-screenshots"
      />
    </div>
  );
}
