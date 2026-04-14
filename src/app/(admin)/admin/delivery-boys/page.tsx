'use client';

import { TopBar } from '@/components/layout/TopBar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/EmptyState';
import { Plus, Mail, Phone, Calendar, Truck } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { toast } from 'sonner';

interface DeliveryBoy {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  role: string;
}

export default function DeliveryBoysPage() {
  const [deliveryBoys, setDeliveryBoys] = useState<DeliveryBoy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeliveryBoys();
  }, []);

  const fetchDeliveryBoys = async () => {
    try {
      setLoading(true);
      const usersRef = collection(db, 'users');
      // Query without orderBy to avoid composite index requirement
      const q = query(usersRef, where('role', '==', 'delivery'));
      
      const querySnapshot = await getDocs(q);
      const boys: DeliveryBoy[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        boys.push({
          uid: doc.id,
          name: data.name || data.displayName || 'Unknown',
          email: data.email || '',
          phone: data.phone || '',
          createdAt: data.createdAt || new Date().toISOString(),
          role: data.role || 'delivery'
        });
      });
      
      // Sort in memory instead of in query
      boys.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA; // Descending order (newest first)
      });
      
      setDeliveryBoys(boys);
    } catch (error) {
      console.error('Error fetching delivery boys:', error);
      toast.error('Failed to load delivery boys');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="min-h-screen">
      <TopBar title="List of Delivery Boys" subtitle="View and manage all delivery personnel" showSearch />
      
      <div className="pt-28 pb-12 px-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#04122e]">All Delivery Boys</h2>
            <p className="text-sm text-[#45464d] mt-1">
              {loading ? 'Loading...' : `${deliveryBoys.length} delivery ${deliveryBoys.length === 1 ? 'person' : 'personnel'} registered`}
            </p>
          </div>
          <Link href="/admin/delivery-boys/create">
            <Button className="bg-[#04122e] hover:bg-[#1a2744] text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg">
              <Plus className="w-5 h-5" />
              Create New Account
            </Button>
          </Link>
        </div>

        {loading ? (
          <Card className="rounded-2xl shadow-[0_20px_40px_rgba(4,18,46,0.04)] overflow-hidden border border-[#c5c6ce]/10 p-8">
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-[#04122e] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[#45464d] font-medium">Loading delivery personnel...</p>
              </div>
            </div>
          </Card>
        ) : deliveryBoys.length === 0 ? (
          <Card className="rounded-2xl shadow-[0_20px_40px_rgba(4,18,46,0.04)] overflow-hidden border border-[#c5c6ce]/10 p-8">
            <EmptyState 
              title="No delivery staff loaded" 
              description="Delivery personnel records will appear here when they are connected from your data source."
              action={
                <Link href="/admin/delivery-boys/create">
                  <Button className="bg-[#04122e] text-white">
                    Create First Account
                  </Button>
                </Link>
              }
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deliveryBoys.map((boy) => (
              <Card key={boy.uid} className="rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow border border-[#c5c6ce]/10">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#04122e] to-[#1a2744] rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {boy.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-lg text-xs font-bold">
                    <Truck className="w-3 h-3" />
                    Active
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-[#04122e] mb-1">{boy.name}</h3>
                    <p className="text-xs text-[#75777e] uppercase tracking-wider font-bold">Delivery Personnel</p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-[#eaeef2]">
                    <div className="flex items-center gap-2 text-sm text-[#45464d]">
                      <Mail className="w-4 h-4 text-[#75777e]" />
                      <span className="truncate">{boy.email}</span>
                    </div>
                    
                    {boy.phone && (
                      <div className="flex items-center gap-2 text-sm text-[#45464d]">
                        <Phone className="w-4 h-4 text-[#75777e]" />
                        <span>{boy.phone}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm text-[#45464d]">
                      <Calendar className="w-4 h-4 text-[#75777e]" />
                      <span>Joined {formatDate(boy.createdAt)}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#eaeef2] flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex-1 text-xs font-bold rounded-lg"
                    >
                      View Details
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 bg-[#04122e] text-white text-xs font-bold rounded-lg"
                    >
                      Assign Parcel
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
