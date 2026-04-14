'use client';

import Link from 'next/link';
import { Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ForgotPasswordSentPage() {
  return (
    <div className="min-h-screen bg-[#f6fafe] flex flex-col">
      {/* Header */}
      <header className="fixed top-0 w-full bg-[#f6fafe]/80 backdrop-blur-xl z-50">
        <nav className="flex justify-between items-center w-full px-8 py-4">
          <Link
            href="/login"
            className="flex items-center gap-1 text-[#04122e] font-semibold hover:bg-[#f0f4f8] transition-colors px-3 py-2 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Login
          </Link>
          <div className="absolute left-1/2 -translate-x-1/2">
            <span className="text-xl font-['Plus_Jakarta_Sans'] font-bold text-[#04122e] tracking-tighter">
              ParcelPort
            </span>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-6 pt-24 pb-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-[2rem] p-10 shadow-[0px_20px_40px_rgba(4,18,46,0.04)] border border-[#c5c6ce]/15 flex flex-col items-center">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 relative">
              <Mail className="w-10 h-10 text-green-600" />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">✓</span>
              </div>
            </div>

            {/* Headline */}
            <div className="text-center mb-8">
              <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#04122e] tracking-tight mb-2">
                Check your email
              </h1>
              <p className="text-[#45464d] text-sm leading-relaxed max-w-[320px] mx-auto">
                We&apos;ve sent a password reset link to your email address. Click the link to create a new password.
              </p>
            </div>

            {/* Info Box */}
            <div className="w-full bg-[#d9e2ff]/30 border border-[#d9e2ff] rounded-xl p-4 mb-8">
              <p className="text-xs text-[#3a4665] leading-relaxed text-center">
                <span className="font-bold">Didn&apos;t receive the email?</span> Check your spam folder or wait a few
                minutes before requesting another link.
              </p>
            </div>

            {/* Actions */}
            <div className="w-full space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 border-[#c5c6ce] rounded-xl font-semibold hover:bg-[#f0f4f8]"
              >
                Resend Email
              </Button>
              <Link href="/login" className="block">
                <Button className="w-full h-12 bg-gradient-to-br from-[#04122e] to-[#1a2744] text-white font-semibold rounded-xl">
                  Return to Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
