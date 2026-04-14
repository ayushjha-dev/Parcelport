'use client';

import { useRouter } from 'next/navigation';
import { TopBar } from '@/components/layout/TopBar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Upload, CheckCircle, Copy } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

export default function RegisterParcelStep4Page() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    paymentMethod: '',
    transactionId: '',
    paymentDate: '',
    screenshot: null as File | null,
  });

  const [copied, setCopied] = useState(false);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);

  const paymentMethods = [
    { value: 'upi', label: 'UPI / GPay / PhonePe', icon: '📱' },
    { value: 'netbanking', label: 'Net Banking', icon: '🏦' },
  ];

  const upiDetails = {
    upiId: '8092137404@axl',
    qrCode: '/payment-qr.jpeg',
  };

  const bankDetails = {
    accountName: 'ParcelPort Services',
    accountNumber: '1234567890',
    ifscCode: 'SBIN0001234',
    bankName: 'State Bank of India',
    branch: 'University Campus Branch',
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, screenshot: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const isFormValid = () => {
    return (
      formData.paymentMethod !== '' &&
      formData.transactionId.trim() !== '' &&
      formData.paymentDate !== '' &&
      formData.screenshot !== null
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      alert('Parcel registration completed successfully!');
      router.push('/student/parcels');
    } else {
      alert('Please fill in all required fields before submitting.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f6fafe]">
      <TopBar title="Register New Parcel" subtitle="Step 4 of 4 - Final Step" showSearch={false} />
      
      <div className="pt-24 px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="rounded-xl p-10 shadow-sm">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#04122e] mb-1">Step 4 — Payment</h2>
              <p className="text-[#45464d] text-sm">Pay ₹10 delivery fee to complete registration</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Delivery Fee */}
              <div className="bg-[#ffddb8]/30 border border-[#ffddb8] rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-bold text-[#653e00]">Delivery Fee</span>
                  <span className="text-2xl font-extrabold text-[#04122e]">₹10</span>
                </div>
                <p className="text-xs text-[#653e00]">Flat fee for doorstep delivery to your room</p>
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-4">
                <Label className="text-xs font-bold text-[#04122e] uppercase tracking-widest">
                  Select Payment Method <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: method.value })}
                      className={`p-6 border-2 rounded-xl transition-all hover:shadow-lg ${
                        formData.paymentMethod === method.value
                          ? 'border-[#04122e] bg-[#04122e]/5'
                          : 'border-[#c5c6ce] hover:border-[#04122e]'
                      }`}
                    >
                      <div className="text-4xl mb-3">{method.icon}</div>
                      <h3 className="font-bold text-[#04122e]">{method.label}</h3>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Details - UPI */}
              {formData.paymentMethod === 'upi' && (
                <div className="bg-[#f0f4f8] rounded-xl p-8">
                  <h3 className="text-lg font-bold text-[#04122e] mb-6 text-center">UPI Payment Details</h3>
                  
                  <div className="flex flex-col items-center space-y-6">
                    {/* QR Code */}
                    <div className="w-64 h-64 bg-white rounded-xl border-2 border-[#c5c6ce] overflow-hidden flex items-center justify-center">
                      <Image 
                        src={upiDetails.qrCode}
                        alt="UPI Payment QR Code"
                        width={256}
                        height={256}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* UPI ID */}
                    <div className="w-full max-w-md">
                      <Label className="text-xs font-bold text-[#04122e] uppercase tracking-widest mb-2 block">
                        UPI ID
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input 
                          value={upiDetails.upiId}
                          readOnly
                          className="bg-white border-[#c5c6ce] rounded-xl font-mono"
                        />
                        <Button
                          type="button"
                          onClick={() => copyToClipboard(upiDetails.upiId)}
                          className="bg-[#04122e] text-white rounded-xl px-4"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      {copied && (
                        <p className="text-xs text-green-600 mt-1">✓ Copied to clipboard!</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Details - Net Banking */}
              {formData.paymentMethod === 'netbanking' && (
                <div className="bg-[#f0f4f8] rounded-xl p-8">
                  <h3 className="text-lg font-bold text-[#04122e] mb-6">Bank Account Details</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs font-bold text-[#45464d] uppercase tracking-widest">
                          Account Name
                        </Label>
                        <p className="text-[#04122e] font-semibold mt-1">{bankDetails.accountName}</p>
                      </div>
                      <div>
                        <Label className="text-xs font-bold text-[#45464d] uppercase tracking-widest">
                          Bank Name
                        </Label>
                        <p className="text-[#04122e] font-semibold mt-1">{bankDetails.bankName}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs font-bold text-[#45464d] uppercase tracking-widest">
                          Account Number
                        </Label>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-[#04122e] font-mono font-semibold">{bankDetails.accountNumber}</p>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(bankDetails.accountNumber)}
                            className="text-[#04122e] hover:text-[#1a2744]"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs font-bold text-[#45464d] uppercase tracking-widest">
                          IFSC Code
                        </Label>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-[#04122e] font-mono font-semibold">{bankDetails.ifscCode}</p>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(bankDetails.ifscCode)}
                            className="text-[#04122e] hover:text-[#1a2744]"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs font-bold text-[#45464d] uppercase tracking-widest">
                        Branch
                      </Label>
                      <p className="text-[#04122e] font-semibold mt-1">{bankDetails.branch}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Transaction Details - Only show after payment method is selected */}
              {formData.paymentMethod && (
                <>
                  <div className="border-t border-[#eaeef2] pt-8">
                    <h3 className="text-lg font-bold text-[#04122e] mb-6">Payment Confirmation</h3>
                    
                    <div className="space-y-6">
                      {/* Transaction ID */}
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-[#04122e] uppercase tracking-widest">
                          Transaction ID / Reference Number <span className="text-red-500">*</span>
                        </Label>
                        <Input 
                          value={formData.transactionId}
                          onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                          placeholder="e.g. TXN123456789 or UTR number" 
                          className="bg-[#f0f4f8] border-transparent rounded-xl" 
                          required
                        />
                      </div>

                      {/* Payment Date */}
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-[#04122e] uppercase tracking-widest">
                          Payment Date <span className="text-red-500">*</span>
                        </Label>
                        <Input 
                          type="date" 
                          value={formData.paymentDate}
                          onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                          className="bg-[#f0f4f8] border-transparent rounded-xl" 
                          required
                        />
                      </div>

                      {/* Screenshot Upload */}
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-[#04122e] uppercase tracking-widest">
                          Payment Screenshot <span className="text-red-500">*</span>
                        </Label>
                        <input
                          type="file"
                          id="screenshot-upload"
                          accept="image/*,.pdf"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <label
                          htmlFor="screenshot-upload"
                          className="block border-2 border-dashed border-[#c5c6ce] rounded-xl p-8 text-center hover:border-[#04122e] transition-colors cursor-pointer"
                        >
                          {screenshotPreview ? (
                            <div className="space-y-3">
                              <div className="w-32 h-32 mx-auto rounded-lg overflow-hidden border border-[#c5c6ce]">
                                <img 
                                  src={screenshotPreview} 
                                  alt="Payment screenshot preview" 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <p className="text-sm font-medium text-green-600">✓ Screenshot uploaded</p>
                              <p className="text-xs text-[#75777e]">Click to change</p>
                            </div>
                          ) : (
                            <>
                              <Upload className="w-8 h-8 text-[#45464d] mx-auto mb-3" />
                              <p className="text-sm font-medium text-[#45464d] mb-1">Click to upload or drag and drop</p>
                              <p className="text-xs text-[#75777e]">PNG, JPG or PDF (max. 5MB)</p>
                            </>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#d9e2ff]/30 border border-[#d9e2ff] rounded-xl p-5">
                    <p className="text-sm text-[#3a4665] leading-relaxed">
                      <span className="font-bold">Note:</span> Please ensure you complete the payment and upload the screenshot. Your parcel registration will be verified once the payment is confirmed by our team.
                    </p>
                  </div>
                </>
              )}

              <div className="pt-6 border-t border-[#eaeef2] flex items-center justify-between">
                <Button 
                  type="button" 
                  variant="ghost"
                  onClick={() => router.push('/student/parcels/new/step-3')}
                  className="font-bold flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <Button 
                  type="submit"
                  disabled={!isFormValid()}
                  className="bg-gradient-to-br from-[#04122e] to-[#1a2744] text-white rounded-xl font-bold shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="w-4 h-4" />
                  Submit & Complete
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
