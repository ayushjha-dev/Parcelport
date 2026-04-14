'use client';

import { Search, Bell, HelpCircle, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';

interface TopBarProps {
  title: string;
  subtitle?: string;
  showSearch?: boolean;
  showExportButton?: boolean;
  showRegisterButton?: boolean;
}

export function TopBar({
  title,
  subtitle,
  showSearch = true,
  showExportButton = false,
  showRegisterButton = false,
}: TopBarProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Determine the base path based on current route
  const getBasePath = () => {
    if (pathname.startsWith('/admin')) return '/admin';
    if (pathname.startsWith('/delivery')) return '/delivery';
    return '/student';
  };

  const handleNotificationClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const basePath = getBasePath();
    
    // Navigate to notifications page based on role
    if (basePath === '/admin') {
      // Admin doesn't have notifications page yet
      alert('Admin notifications coming soon!');
    } else if (basePath === '/delivery') {
      alert('Delivery notifications coming soon!');
    } else {
      router.push('/student/notifications');
    }
  };

  const handleHelpClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    window.open('mailto:support@parcelport.com', '_blank');
  };

  const handleExportClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Determine what to export based on current page
    const currentPath = pathname;
    
    if (currentPath.includes('/admin/dashboard')) {
      exportDashboardData();
    } else if (currentPath.includes('/admin/parcels')) {
      exportParcelsData();
    } else if (currentPath.includes('/admin/revenue')) {
      exportRevenueData();
    } else {
      // Generic export
      exportGenericData();
    }
  };

  const exportDashboardData = () => {
    const data = {
      exportDate: new Date().toISOString(),
      reportType: 'Admin Dashboard Summary',
      stats: {
        todaysParcels: 0,
        pendingVerification: 0,
        outForDelivery: 0,
        deliveredToday: 0,
        revenueToday: 0
      }
    };
    
    // Export as CSV for better compatibility
    const csvContent = [
      ['Metric', 'Value'],
      ['Export Date', new Date().toLocaleString()],
      ['Report Type', 'Admin Dashboard Summary'],
      ['', ''],
      ['Today\'s Parcels', '0'],
      ['Pending Verification', '0'],
      ['Out for Delivery', '0'],
      ['Delivered Today', '0'],
      ['Revenue Today', '₹0']
    ];
    
    downloadCSV(csvContent, 'dashboard-report');
  };

  const exportParcelsData = () => {
    const csvContent = [
      ['Export Date', new Date().toLocaleString()],
      ['Report Type', 'Parcels Report'],
      ['', ''],
      ['DRID', 'Student', 'Courier', 'Status', 'Date'],
      // Add actual parcel data here when available
      ['No data', 'No data', 'No data', 'No data', 'No data']
    ];
    
    downloadCSV(csvContent, 'parcels-report');
  };

  const exportRevenueData = () => {
    const csvContent = [
      ['Export Date', new Date().toLocaleString()],
      ['Report Type', 'Revenue Report'],
      ['', ''],
      ['Period', 'Amount'],
      ['Today', '₹0'],
      ['This Week', '₹0'],
      ['This Month', '₹0']
    ];
    
    downloadCSV(csvContent, 'revenue-report');
  };

  const exportGenericData = () => {
    const csvContent = [
      ['Export Date', new Date().toLocaleString()],
      ['Report Type', 'Generic Report'],
      ['', ''],
      ['Message', 'No specific data available for export']
    ];
    
    downloadCSV(csvContent, 'report');
  };

  const downloadCSV = (data: string[][], filename: string) => {
    const csvString = data.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Report exported successfully!');
  };

  const downloadJSON = (data: any, filename: string) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Report exported successfully!');
  };

  const handleRegisterClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    router.push('/student/parcels/new/step-1');
  };

  return (
    <header className="fixed top-0 right-0 left-[240px] lg:left-[260px] h-20 bg-[#f6fafe]/80 backdrop-blur-xl flex justify-between items-center px-10 z-40">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight text-[#04122e]">{title}</h1>
        {subtitle && <p className="text-xs text-[#45464d] font-medium">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-6">
        {/* Search */}
        {showSearch && (
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#75777e] w-4 h-4" />
            <Input
              className="pl-10 pr-4 py-2 bg-[#f0f4f8] border-none rounded-xl text-sm w-64 focus:ring-2 focus:ring-[#04122e]/20"
              placeholder="Search parcels, students..."
            />
          </div>
        )}

        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={handleNotificationClick}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#eaeef2] transition-colors text-[#45464d] relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#ba1a1a] rounded-full border-2 border-white"></span>
          </button>
          <button 
            type="button"
            onClick={handleHelpClick}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#eaeef2] transition-colors text-[#45464d]"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {(showExportButton || showRegisterButton) && (
            <>
              <div className="h-8 w-[1px] bg-[#c5c6ce]/30 mx-2"></div>
              {showExportButton && (
                <Button 
                  type="button"
                  onClick={handleExportClick}
                  className="bg-gradient-to-br from-[#04122e] to-[#1a2744] text-white text-sm font-semibold rounded-xl flex items-center gap-2 hover:shadow-lg hover:shadow-[#04122e]/10 transition-all active:scale-95"
                >
                  <FileDown className="w-4 h-4" />
                  Export Report
                </Button>
              )}
              {showRegisterButton && (
                <Button 
                  type="button"
                  onClick={handleRegisterClick}
                  className="bg-gradient-to-br from-[#04122e] to-[#1a2744] text-white text-sm font-semibold rounded-xl hover:opacity-90 active:scale-95 transition-all"
                >
                  Register New Parcel
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
