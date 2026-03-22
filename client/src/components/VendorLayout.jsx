import React, { useState } from 'react';
import VendorSidebar from './VendorSidebar';
import { Menu } from 'lucide-react';

const VendorLayout = ({ children, title }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f0eb] flex">
      <VendorSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        {/* Top bar */}
        <header className="bg-white border-b border-[#e2d5c3] px-6 py-4 flex items-center gap-4 sticky top-0 z-30 shadow-sm">
          <button onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-[#f5f0eb] text-[#8b5e3c]">
            <Menu className="h-6 w-6" />
          </button>
          <div>
            <h2 className="text-xl font-black text-[#4a3224]">{title}</h2>
            <p className="text-xs text-[#8b5e3c] font-medium hidden sm:block">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default VendorLayout;
