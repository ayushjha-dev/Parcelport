'use client';

import Link from 'next/link';
import { Send, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgotPasswordPage() {
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
            {/* Icon */}
            <div className="w-16 h-16 bg-[#ffddb8] rounded-full flex items-center justify-center mb-6">
              <span className="text-[#855300] text-3xl">🔒</span>
            </div>

            {/* Headline */}
            <div className="text-center mb-10">
              <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#04122e] tracking-tight mb-2">
                Forgot your password?
              </h1>
              <p className="text-[#45464d] text-sm leading-relaxed max-w-[280px] mx-auto">
                No worries. Enter your registered email and we&apos;ll send you a reset link.
              </p>
            </div>

            {/* Form */}
            <form className="w-full space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[11px] font-bold uppercase tracking-widest text-[#45464d] ml-1">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@university.edu"
                  className="h-14 bg-[#f0f4f8] border-none rounded-xl"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-14 bg-gradient-to-br from-[#04122e] to-[#1a2744] text-white font-['Plus_Jakarta_Sans'] font-semibold rounded-xl shadow-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                Send Reset Link
                <Send className="w-5 h-5" />
              </Button>
            </form>

            {/* Footer Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-[#45464d]">
                Remember your password?{' '}
                <Link href="/login" className="text-[#855300] font-semibold hover:underline ml-1">
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Branding */}
          <div className="mt-12 flex items-center justify-center gap-6 opacity-30">
            <div className="h-px w-12 bg-[#c5c6ce]"></div>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#45464d]">
              Secure Student Logistics
            </span>
            <div className="h-px w-12 bg-[#c5c6ce]"></div>
          </div>
        </div>
      </main>

      {/* Background Decoration */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -right-[5%] w-[40%] h-[40%] bg-[#d9e2ff]/20 blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-[10%] -left-[5%] w-[30%] h-[30%] bg-[#ffddb8]/20 blur-[100px] rounded-full"></div>
      </div>
    </div>
  );
}
