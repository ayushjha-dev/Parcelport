'use client';

import { useState } from 'react';
import { Payment } from '@/types/payment';
import { Button } from '@/components/ui/button';
import { Check, X, ExternalLink } from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils/format';
import { toast } from 'sonner';

interface PaymentReviewPanelProps {
  payment: Payment;
  onApprove: () => void;
  onReject: () => void;
}

export function PaymentReviewPanel({
  payment,
  onApprove,
  onReject,
}: PaymentReviewPanelProps) {
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState('');

  const handleApprove = async () => {
    try {
      const res = await fetch(`/api/admin/payments/${payment.id}/approve`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to approve');
      toast.success('Payment approved');
      onApprove();
    } catch (error) {
      toast.error('Failed to approve payment');
    }
  };

  const handleReject = async () => {
    if (!reason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      const res = await fetch(`/api/admin/payments/${payment.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) throw new Error('Failed to reject');
      toast.success('Payment rejected');
      onReject();
    } catch (error) {
      toast.error('Failed to reject payment');
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-[0px_20px_40px_rgba(4,18,46,0.04)]">
      <div className="space-y-4">
        <div>
          <p className="text-sm text-[#04122e]/60">Amount</p>
          <p className="text-xl font-bold text-[#04122e]">
            {formatCurrency(payment.amount)}
          </p>
        </div>

        <div>
          <p className="text-sm text-[#04122e]/60">Payment Method</p>
          <p className="font-medium text-[#04122e]">{payment.payment_method}</p>
        </div>

        <div>
          <p className="text-sm text-[#04122e]/60">Date</p>
          <p className="font-medium text-[#04122e]">
            {formatDate(payment.created_at)}
          </p>
        </div>

        {payment.screenshot_url && (
          <div>
            <p className="text-sm text-[#04122e]/60 mb-2">Screenshot</p>
            <a
              href={payment.screenshot_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#855300] hover:underline"
            >
              View Screenshot <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}

        {!rejecting ? (
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleApprove}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Check className="w-4 h-4 mr-2" />
              Approve
            </Button>
            <Button
              onClick={() => setRejecting(true)}
              variant="destructive"
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Reject
            </Button>
          </div>
        ) : (
          <div className="space-y-3 pt-4">
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for rejection..."
              className="w-full p-3 border border-[#04122e]/20 rounded-xl focus:outline-none focus:border-[#04122e]"
              rows={3}
            />
            <div className="flex gap-3">
              <Button onClick={handleReject} variant="destructive" className="flex-1">
                Confirm Reject
              </Button>
              <Button
                onClick={() => setRejecting(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
