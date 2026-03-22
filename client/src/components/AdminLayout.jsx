import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import { Menu } from 'lucide-react';

const AdminLayout = ({ children, title }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-[#f5f0eb] flex font-sans">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        {/* Sticky Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#e2d5c3] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg">
              <Menu className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-[#4a3224]">{title}</h1>
            </div>
          </div>
          <div className="hidden md:block">
            <span className="text-xs font-bold text-gray-500 bg-[#f5f0eb] px-4 py-2 rounded-full border border-[#e2d5c3]">
              {today}
            </span>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
