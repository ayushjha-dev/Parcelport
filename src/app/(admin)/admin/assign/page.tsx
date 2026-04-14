'use client';

import { TopBar } from '@/components/layout/TopBar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/EmptyState';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Package, User, CheckCircle } from 'lucide-react';

interface Parcel {
  id: string;
  drid: string;
  student_name: string;
  student_roll_no: string;
  hostel_block: string;
  floor_number: string;
  room_number: string;
  courier_company: string;
  status: string;
}

interface DeliveryBoy {
  id: string;
  full_name: string;
  mobile_number: string;
  email: string;
}

export default function AssignDeliveryPage() {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [deliveryBoys, setDeliveryBoys] = useState<DeliveryBoy[]>([]);
  const [selectedParcel, setSelectedParcel] = useState<string | null>(null);
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch unassigned parcels (payment_verified status)
      const parcelsResponse = await fetch('/api/admin/parcels?status=payment_verified');
      const parcelsData = await parcelsResponse.json();
      if (parcelsData.success) {
        setParcels(parcelsData.data || []);
      }

      // Fetch delivery boys
      const deliveryBoysResponse = await fetch('/api/admin/delivery-boys');
      const deliveryBoysData = await deliveryBoysResponse.json();
      if (deliveryBoysData.success) {
        setDeliveryBoys(deliveryBoysData.deliveryBoys || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedParcel || !selectedDeliveryBoy) {
      toast.error('Please select both a parcel and a delivery boy');
      return;
    }

    try {
      setAssigning(true);
      const response = await fetch('/api/admin/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parcel_id: selectedParcel,
          delivery_boy_id: selectedDeliveryBoy,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Parcel assigned successfully');
        setSelectedParcel(null);
        setSelectedDeliveryBoy(null);
        fetchData();
      } else {
        toast.error(data.error || 'Failed to assign parcel');
      }
    } catch (error) {
      console.error('Error assigning parcel:', error);
      toast.error('Failed to assign parcel');
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="min-h-screen">
      <TopBar title="Assign Delivery Boys" subtitle="Assign parcels to delivery personnel" showSearch />
      
      <div className="pt-28 pb-12 px-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Unassigned Parcels */}
          <div className="lg:col-span-2">
            <Card className="rounded-2xl shadow-[0_20px_40px_rgba(4,18,46,0.04)] overflow-hidden border border-[#c5c6ce]/10">
              <div className="p-6 border-b border-[#eaeef2]">
                <h2 className="text-xl font-bold text-[#04122e]">Unassigned Parcels</h2>
                <p className="text-sm text-[#45464d] mt-1">
                  {parcels.length} parcel{parcels.length !== 1 ? 's' : ''} ready for assignment
                </p>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="text-center py-8 text-[#45464d]">Loading parcels...</div>
                ) : parcels.length === 0 ? (
                  <EmptyState
                    title="No parcels to assign"
                    description="Parcels with verified payments will appear here when ready for dispatch."
                  />
                ) : (
                  <div className="space-y-3">
                    {parcels.map((parcel) => (
                      <Card
                        key={parcel.id}
                        className={`p-4 rounded-xl cursor-pointer transition-all ${
                          selectedParcel === parcel.id
                            ? 'border-2 border-blue-500 bg-blue-50/30'
                            : 'border border-[#c5c6ce]/10 hover:border-blue-300'
                        }`}
                        onClick={() => setSelectedParcel(parcel.id)}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-bold text-[#04122e]">{parcel.drid}</h3>
                                <p className="text-xs text-[#45464d]">{parcel.courier_company}</p>
                              </div>
                              {selectedParcel === parcel.id && (
                                <CheckCircle className="w-5 h-5 text-blue-600" />
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <p className="text-xs text-[#75777e]">Student</p>
                                <p className="font-bold text-[#04122e]">{parcel.student_name}</p>
                              </div>
                              <div>
                                <p className="text-xs text-[#75777e]">Location</p>
                                <p className="font-bold text-[#04122e]">
                                  Block {parcel.hostel_block}, Room {parcel.room_number}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Delivery Boys Status */}
          <div>
            <Card className="rounded-2xl shadow-[0_20px_40px_rgba(4,18,46,0.04)] border border-[#c5c6ce]/10">
              <div className="p-6 border-b border-[#eaeef2]">
                <h3 className="text-lg font-bold text-[#04122e]">Delivery Boys</h3>
                <p className="text-sm text-[#45464d] mt-1">
                  {deliveryBoys.length} available
                </p>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="text-center py-8 text-[#45464d]">Loading...</div>
                ) : deliveryBoys.length === 0 ? (
                  <EmptyState 
                    title="No delivery staff" 
                    description="Create delivery boy accounts to assign parcels." 
                  />
                ) : (
                  <div className="space-y-3">
                    {deliveryBoys.map((boy) => (
                      <Card
                        key={boy.id}
                        className={`p-4 rounded-xl cursor-pointer transition-all ${
                          selectedDeliveryBoy === boy.id
                            ? 'border-2 border-green-500 bg-green-50/30'
                            : 'border border-[#c5c6ce]/10 hover:border-green-300'
                        }`}
                        onClick={() => setSelectedDeliveryBoy(boy.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <User className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <h4 className="font-bold text-[#04122e] truncate">{boy.full_name}</h4>
                              {selectedDeliveryBoy === boy.id && (
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-[#45464d] truncate">{boy.mobile_number}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
              
              {deliveryBoys.length > 0 && parcels.length > 0 && (
                <div className="p-6 border-t border-[#eaeef2]">
                  <Button
                    onClick={handleAssign}
                    disabled={!selectedParcel || !selectedDeliveryBoy || assigning}
                    className="w-full bg-[#04122e] hover:bg-[#04122e]/90 text-white font-bold py-3 rounded-xl"
                  >
                    {assigning ? 'Assigning...' : 'Assign Parcel'}
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
