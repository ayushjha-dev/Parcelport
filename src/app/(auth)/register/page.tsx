'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import type { Database } from '@/lib/supabase/database.types';
import { registerSchema } from '@/lib/validations/auth';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    studentRollNo: '',
    email: '',
    mobile: '',
    courseBranch: '',
    hostelBlock: '',
    floorNumber: '',
    roomNumber: '',
    landmark: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      full_name: formData.fullName.trim(),
      email: formData.email.trim().toLowerCase(),
      mobile_number: formData.mobile.trim(),
      student_roll_no: formData.studentRollNo.trim(),
      course_branch: formData.courseBranch.trim(),
      hostel_block: formData.hostelBlock.trim(),
      floor_number: formData.floorNumber.trim(),
      room_number: formData.roomNumber.trim(),
      password: formData.password,
      confirm_password: formData.confirmPassword,
    };

    const parsedPayload = registerSchema.safeParse(payload);
    if (!parsedPayload.success) {
      toast.error(parsedPayload.error.issues[0]?.message || 'Please complete all required fields correctly.');
      return;
    }

    if (!formData.agreeTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);

    try {
      const validData = parsedPayload.data;

      // Register with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: validData.email,
        password: validData.password,
        options: {
          data: {
            full_name: validData.full_name,
            mobile_number: `+91${validData.mobile_number}`,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No user data returned');

      // Create profile in database
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: authData.user.id,
          email: validData.email,
          full_name: validData.full_name,
          mobile_number: `+91${validData.mobile_number}`,
          role: 'student' as const,
          student_roll_no: validData.student_roll_no,
          course_branch: validData.course_branch,
          hostel_block: validData.hostel_block,
          room_number: validData.room_number,
          floor_number: validData.floor_number,
          landmark_note: formData.landmark.trim() || null,
          is_active: true,
        }] as any);

      if (profileError) throw profileError;

      toast.success('Account created successfully!');
      router.push('/student/dashboard');
    } catch (error: unknown) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Registration failed. Please try again.';
      if (error && typeof error === 'object' && 'message' in error) {
        const supabaseError = error as { message: string };
        if (supabaseError.message.includes('already registered')) {
          errorMessage = 'This email is already registered.';
        } else if (supabaseError.message.includes('Password')) {
          errorMessage = 'Password is too weak. Use at least 6 characters.';
        } else if (supabaseError.message.includes('email')) {
          errorMessage = 'Invalid email address.';
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6fafe]">
      {/* Top Nav */}
      <nav className="fixed top-0 w-full z-50 bg-[#f6fafe]/80 backdrop-blur-xl shadow-[0px_20px_40px_rgba(4,18,46,0.06)]">
        <div className="max-w-7xl mx-auto px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Package2 className="text-[#855300] w-8 h-8" />
            <span className="text-2xl font-['Plus_Jakarta_Sans'] font-bold tracking-tighter text-[#04122e]">
              ParcelPort
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-[#855300] font-bold text-sm hover:underline">
              Already registered? Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Page Header */}
      <header className="pt-32 pb-12 bg-white border-b border-[#c5c6ce]/15">
        <div className="max-w-7xl mx-auto px-12">
          <h1 className="text-4xl font-['Plus_Jakarta_Sans'] font-extrabold text-[#04122e] tracking-tight mb-2">
            Create your student account
          </h1>
          <p className="text-[#45464d] text-lg max-w-2xl leading-relaxed">
            Set up once — your room details are saved for all future parcels. Welcome to the premium concierge
            experience.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Form Column */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white rounded-3xl p-10 shadow-[0px_20px_40px_rgba(4,18,46,0.04)] border border-[#c5c6ce]/10">
              <form onSubmit={handleSubmit} className="space-y-12">
                {/* Personal Details */}
                <section>
                  <div className="flex items-center gap-3 mb-8 border-b border-[#c5c6ce]/15 pb-4">
                    <span className="text-[#b9c6eb]">👤</span>
                    <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#45464d]">
                      Personal Details
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-[#45464d]">Full Name *</Label>
                      <Input 
                        placeholder="Your full name" 
                        className="bg-[#f0f4f8] border-transparent rounded-xl"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-[#45464d]">Student Roll No *</Label>
                      <Input 
                        placeholder="Your student roll number" 
                        className="bg-[#f0f4f8] border-transparent rounded-xl"
                        value={formData.studentRollNo}
                        onChange={(e) => handleInputChange('studentRollNo', e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-[#45464d]">Email Address *</Label>
                      <Input
                        type="email"
                        placeholder="your.email@example.com"
                        className="bg-[#f0f4f8] border-transparent rounded-xl"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-[#45464d]">Mobile Number *</Label>
                      <div className="flex">
                        <span className="inline-flex items-center px-4 rounded-l-xl bg-[#eaeef2] text-[#45464d] text-sm font-medium">
                          +91
                        </span>
                        <Input
                          placeholder="Your mobile number"
                          className="bg-[#f0f4f8] border-transparent rounded-r-xl border-l-0"
                          value={formData.mobile}
                          onChange={(e) => handleInputChange('mobile', e.target.value)}
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label className="text-sm font-semibold text-[#45464d]">Course/Branch *</Label>
                      <Select 
                        value={formData.courseBranch} 
                        onValueChange={(value) => handleInputChange('courseBranch', value)}
                        disabled={loading}
                      >
                        <SelectTrigger className="bg-[#f0f4f8] border-transparent rounded-xl">
                          <SelectValue placeholder="Select your course" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="btech-cse">B.Tech Computer Science (CSE)</SelectItem>
                          <SelectItem value="btech-ece">B.Tech Electronics (ECE)</SelectItem>
                          <SelectItem value="btech-me">B.Tech Mechanical (ME)</SelectItem>
                          <SelectItem value="mba">MBA Graduate Studies</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </section>

                {/* Hostel Details */}
                <section>
                  <div className="flex items-center gap-3 mb-8 border-b border-[#c5c6ce]/15 pb-4">
                    <span className="text-[#b9c6eb]">🏢</span>
                    <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#45464d]">
                      Hostel & Room Details
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-[#45464d]">Hostel Block *</Label>
                      <Select 
                        value={formData.hostelBlock} 
                        onValueChange={(value) => handleInputChange('hostelBlock', value)}
                        disabled={loading}
                      >
                        <SelectTrigger className="bg-[#f0f4f8] border-transparent rounded-xl">
                          <SelectValue placeholder="Select block" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="a">Block A - Newton</SelectItem>
                          <SelectItem value="b">Block B - Raman</SelectItem>
                          <SelectItem value="c">Block C - Kalam</SelectItem>
                          <SelectItem value="g">Girls Hostel - Block G</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-[#45464d]">Floor Number *</Label>
                      <Input 
                        placeholder="e.g. 4th" 
                        className="bg-[#f0f4f8] border-transparent rounded-xl"
                        value={formData.floorNumber}
                        onChange={(e) => handleInputChange('floorNumber', e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-[#45464d]">Room Number *</Label>
                      <Input 
                        placeholder="e.g. 412" 
                        className="bg-[#f0f4f8] border-transparent rounded-xl"
                        value={formData.roomNumber}
                        onChange={(e) => handleInputChange('roomNumber', e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="md:col-span-3 space-y-2">
                      <Label className="text-sm font-semibold text-[#45464d]">Landmark/Note (Optional)</Label>
                      <Input
                        placeholder="Near water cooler / Last room on right"
                        className="bg-[#f0f4f8] border-transparent rounded-xl"
                        value={formData.landmark}
                        onChange={(e) => handleInputChange('landmark', e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </section>

                {/* Security */}
                <section>
                  <div className="flex items-center gap-3 mb-8 border-b border-[#c5c6ce]/15 pb-4">
                    <span className="text-[#b9c6eb]">🔒</span>
                    <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#45464d]">Account Security</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-[#45464d]">Password *</Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          className="bg-[#f0f4f8] border-transparent rounded-xl pr-12"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          required
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#45464d]/50 hover:text-[#04122e]"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-[#45464d]">Confirm Password *</Label>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          className="bg-[#f0f4f8] border-transparent rounded-xl pr-12"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          required
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#45464d]/50 hover:text-[#04122e]"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Submit */}
                <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-[#c5c6ce]/15">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded border-[#c5c6ce] text-[#04122e]"
                      checked={formData.agreeTerms}
                      onChange={(e) => handleInputChange('agreeTerms', e.target.checked)}
                      disabled={loading}
                    />
                    <span className="text-sm text-[#45464d]">
                      I agree to the{' '}
                      <Link href="#" className="text-[#855300] font-bold">
                        Terms & Conditions
                      </Link>
                    </span>
                  </label>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto bg-[#04122e] hover:bg-[#1a2744] text-white px-10 py-4 rounded-xl font-bold shadow-xl disabled:opacity-50"
                  >
                    {loading ? 'Creating Account...' : 'Create Account →'}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-5 space-y-6 sticky top-32">
            <div className="bg-[#ffddb8]/30 border border-[#ffddb8] rounded-[2rem] p-8">
              <h3 className="text-xl font-bold text-[#684000] mb-8 flex items-center gap-2">
                ✨ What happens next?
              </h3>
              <ul className="space-y-8">
                {[
                  {
                    num: '1',
                    title: 'Verify mobile via OTP',
                    desc: "We'll send a 6-digit code to ensure it's really you.",
                  },
                  {
                    num: '2',
                    title: 'Receive parcels at gate',
                    desc: 'Your orders from Amazon, Flipkart, etc. arrive at the main gate.',
                  },
                  {
                    num: '3',
                    title: 'Delivery to your room',
                    desc: 'Our concierge team brings it right to your doorstep within 30 mins.',
                  },
                ].map((step) => (
                  <li key={step.num} className="flex gap-5">
                    <div className="w-10 h-10 shrink-0 bg-white rounded-xl flex items-center justify-center text-[#855300] font-bold shadow-sm">
                      {step.num}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#684000] mb-1">{step.title}</h4>
                      <p className="text-sm text-[#653e00] leading-relaxed">{step.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-[#c5c6ce]/15 rounded-[2rem] p-8 shadow-[0px_20px_40px_rgba(4,18,46,0.02)]">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-[#f0f4f8] rounded-xl">💳</div>
                <span className="bg-[#855300]/10 text-[#855300] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  Best Value
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#45464d] uppercase tracking-widest mb-6">Delivery Charge</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-5xl font-extrabold text-[#04122e] tracking-tighter">₹10</span>
                <span className="text-[#45464d] font-medium">/ parcel</span>
              </div>
              <p className="text-[#45464d] text-sm mb-8 leading-relaxed">
                Flat fee per parcel delivered directly to your room. No hidden costs or subscriptions required.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
