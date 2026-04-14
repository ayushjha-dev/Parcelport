'use client';

import { TopBar } from '@/components/layout/TopBar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/EmptyState';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Assignment {
  id: string;
  otp_code: string;
  picked_from_gate_at: string | null;
  delivered_at: string | null;
  parcels: {
    id: string;
    drid: string;
    student_name: string;
    student_mobile: string;
    hostel_block: string;
    floor_number: string;
    room_number: string;
    courier_company: string;
    status: string;
  };
}

export default function DeliveryDashboardPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/delivery/today');
      const data = await response.json();
      if (data.success) {
        setAssignments(data.data || []);
      } else {
        toast.error(data.error || 'Failed to load assignments');
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast.error('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const totalAssigned = assignments.length;
  const inProgress = assignments.filter(a => a.picked_from_gate_at && !a.delivered_at).length;
  const completed = assignments.filter(a => a.delivered_at).length;

  return (
    <div className="min-h-screen">
      <TopBar 
        title="Today's Deliveries" 
        subtitle={`${totalAssigned} parcel${totalAssigned !== 1 ? 's' : ''} assigned`} 
        showSearch={false} 
      />
      
      <div className="pt-28 pb-12 px-10">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="grid grid-cols-3 gap-6 mb-8">
            <Card className="p-6 rounded-xl bg-[#d9e2ff] border-[#d9e2ff]">
              <p className="text-sm font-bold text-[#3a4665] mb-2">Total Assigned</p>
              <p className="text-3xl font-extrabold text-[#04122e]">{totalAssigned}</p>
            </Card>
            <Card className="p-6 rounded-xl bg-amber-100 border-amber-100">
              <p className="text-sm font-bold text-amber-800 mb-2">In Progress</p>
              <p className="text-3xl font-extrabold text-amber-900">{inProgress}</p>
            </Card>
            <Card className="p-6 rounded-xl bg-green-100 border-green-100">
              <p className="text-sm font-bold text-green-800 mb-2">Completed</p>
              <p className="text-3xl font-extrabold text-green-900">{completed}</p>
            </Card>
          </div>

          <h2 className="text-xl font-bold text-[#04122e] mb-4">Assigned Parcels</h2>
          
          {loading ? (
            <div className="text-center py-8 text-[#45464d]">Loading...</div>
          ) : assignments.length === 0 ? (
            <EmptyState
              title="No deliveries assigned"
              description="Assigned parcels will appear here when admin assigns deliveries to you."
            />
          ) : (
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <Card key={assignment.id} className="p-6 rounded-xl border border-[#c5c6ce]/10">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-[#04122e]">{assignment.parcels.drid}</h3>
                      <p className="text-sm text-[#45464d]">{assignment.parcels.courier_company}</p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      assignment.delivered_at ? 'bg-green-100 text-green-700' :
                      assignment.picked_from_gate_at ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {assignment.delivered_at ? 'Delivered' :
                       assignment.picked_from_gate_at ? 'In Progress' :
                       'Assigned'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs font-bold text-[#45464d] mb-1">Student</p>
                      <p className="text-sm font-bold text-[#04122e]">{assignment.parcels.student_name}</p>
                      <p className="text-xs text-[#45464d]">{assignment.parcels.student_mobile}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#45464d] mb-1">Location</p>
                      <p className="text-sm font-bold text-[#04122e]">
                        Block {assignment.parcels.hostel_block}, Floor {assignment.parcels.floor_number}, Room {assignment.parcels.room_number}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={() => router.push(`/delivery/parcel/${assignment.parcels.drid}`)}
                      className="flex-1 bg-[#04122e] hover:bg-[#04122e]/90 text-white"
                    >
                      View Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
