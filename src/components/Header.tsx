import React from 'react';
import { PlusCircle, Shield, ShieldCheck, LogOut } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  isAdmin: boolean;
  onOpenAddModal: () => void;
  onOpenAdminModal: () => void;
  onAdminLogout: () => void;
  pendingCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  isAdmin,
  onOpenAddModal,
  onOpenAdminModal,
  onAdminLogout,
  pendingCount
}) => {
  return (
    <header
      id="app-header"
      className="sticky top-0 z-30 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E7E1D7] transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo - Fixed permanent emblem */}
          <BrandLogo
            size="md"
            showSubtitle={true}
          />

          {/* Actions & Navigation Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Share Spot Primary Button */}
            <button
              id="header-share-spot-btn"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#114B3E] hover:bg-[#0D3B31] text-white font-medium text-xs sm:text-sm transition-all shadow-xs hover:shadow active:scale-[0.98] cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-emerald-200" />
              <span className="hidden sm:inline">Share a Spot</span>
              <span className="sm:hidden">Share</span>
            </button>

            {/* Admin Action */}
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <button
                  id="header-admin-active-btn"
                  onClick={onOpenAdminModal}
                  className="relative inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#114B3E]/10 text-[#114B3E] border border-[#114B3E]/20 text-xs sm:text-sm font-semibold hover:bg-[#114B3E]/20 transition cursor-pointer"
                  title="Admin Dashboard"
                >
                  <ShieldCheck className="w-4 h-4 text-[#114B3E]" />
                  <span className="hidden md:inline">Admin Mode</span>
                  {pendingCount > 0 && (
                    <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-[#C25E37] rounded-full">
                      {pendingCount}
                    </span>
                  )}
                </button>
                <button
                  id="header-admin-logout-btn"
                  onClick={onAdminLogout}
                  className="p-2.5 rounded-xl text-[#6B6E6A] hover:text-[#181B1A] hover:bg-[#EFE9DE] border border-[#E0D9CD] transition cursor-pointer"
                  title="Logout from Admin Mode"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="header-admin-login-btn"
                onClick={onOpenAdminModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-[#565955] hover:text-[#181B1A] hover:bg-[#EFE9DE]/70 border border-[#E0D9CD] text-xs sm:text-sm font-medium transition cursor-pointer"
              >
                <Shield className="w-4 h-4 text-[#7A7E79]" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
