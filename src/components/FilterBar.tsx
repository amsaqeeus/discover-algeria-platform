import React from 'react';
import { Search, MapPin, Sparkles, X, Shield } from 'lucide-react';
import { ALGERIA_WILAYAS, VIBE_CATEGORIES } from '../data/wilayasAndVibes';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedWilaya: string;
  onWilayaChange: (val: string) => void;
  selectedVibe: string;
  onVibeChange: (val: string) => void;
  sortBy: string;
  onSortChange: (val: string) => void;
  adminViewFilter?: 'all' | 'approved' | 'pending';
  onAdminViewFilterChange?: (val: 'all' | 'approved' | 'pending') => void;
  isAdmin: boolean;
  totalSpotsCount: number;
  pendingCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedWilaya,
  onWilayaChange,
  selectedVibe,
  onVibeChange,
  sortBy,
  onSortChange,
  adminViewFilter = 'approved',
  onAdminViewFilterChange,
  isAdmin,
  totalSpotsCount,
  pendingCount
}) => {
  const hasActiveFilters = Boolean(searchQuery || selectedWilaya || selectedVibe);

  const handleClearFilters = () => {
    onSearchChange('');
    onWilayaChange('');
    onVibeChange('');
  };

  return (
    <section id="filter-bar-section" className="mb-10 space-y-5">
      {/* Search & Location Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E7E1D7] shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center">
          {/* Keyword Search */}
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8E88]" />
            <input
              id="search-spots-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search spots, peaceful gardens, scenic cliffs..."
              className="w-full pl-10 pr-9 py-2.5 bg-[#FAF8F5] border border-[#DDD6CA] rounded-xl text-[#181B1A] placeholder-[#8A8E88] text-sm focus:outline-none focus:ring-2 focus:ring-[#114B3E]/30 focus:border-[#114B3E] transition"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8E88] hover:text-[#181B1A] p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Wilaya Picker */}
          <div className="md:col-span-4 relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8E88] pointer-events-none" />
            <select
              id="wilaya-select-dropdown"
              value={selectedWilaya}
              onChange={(e) => onWilayaChange(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 bg-[#FAF8F5] border border-[#DDD6CA] rounded-xl text-[#181B1A] text-sm focus:outline-none focus:ring-2 focus:ring-[#114B3E]/30 focus:border-[#114B3E] appearance-none cursor-pointer transition"
            >
              <option value="">All Algeria Wilayas (58 الولاية)</option>
              {ALGERIA_WILAYAS.map((w) => (
                <option key={w.code} value={w.name}>
                  {w.code} — {w.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#8A8E88] text-xs">
              ▼
            </div>
          </div>

          {/* Sorting */}
          <div className="md:col-span-3 flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#737771] shrink-0">
              Sort:
            </span>
            <select
              id="sort-select-dropdown"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full py-2.5 px-3 bg-[#FAF8F5] border border-[#DDD6CA] rounded-xl text-[#181B1A] text-sm focus:outline-none focus:ring-2 focus:ring-[#114B3E]/30 focus:border-[#114B3E] cursor-pointer transition"
            >
              <option value="highest_rated">Highest Rated</option>
              <option value="most_reviews">Most Reviews</option>
              <option value="newest">Recently Added</option>
            </select>
          </div>
        </div>

        {/* Admin Tabs Bar (when in Admin mode) */}
        {isAdmin && onAdminViewFilterChange && (
          <div className="mt-4 pt-3.5 border-t border-[#EFE9DE] flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 bg-[#F1ECE4] p-1 rounded-xl text-xs font-medium text-[#525653]">
              <button
                id="admin-filter-approved"
                onClick={() => onAdminViewFilterChange('approved')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  adminViewFilter === 'approved'
                    ? 'bg-white text-[#181B1A] shadow-xs font-semibold'
                    : 'hover:text-[#181B1A]'
                }`}
              >
                Published ({totalSpotsCount})
              </button>
              <button
                id="admin-filter-pending"
                onClick={() => onAdminViewFilterChange('pending')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  adminViewFilter === 'pending'
                    ? 'bg-[#C25E37] text-white shadow-xs font-semibold'
                    : 'hover:text-[#181B1A]'
                }`}
              >
                Pending Approval
                {pendingCount > 0 && (
                  <span className="px-1.5 py-0.5 bg-black/20 text-white rounded-full text-[10px]">
                    {pendingCount}
                  </span>
                )}
              </button>
              <button
                id="admin-filter-all"
                onClick={() => onAdminViewFilterChange('all')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  adminViewFilter === 'all'
                    ? 'bg-white text-[#181B1A] shadow-xs font-semibold'
                    : 'hover:text-[#181B1A]'
                }`}
              >
                All Records
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[#114B3E] bg-[#114B3E]/10 px-3 py-1.5 rounded-lg border border-[#114B3E]/20 font-medium">
              <Shield className="w-3.5 h-3.5 text-[#114B3E]" />
              <span>Admin Mode active — Moderating spots and reviews.</span>
            </div>
          </div>
        )}
      </div>

      {/* Vibe Pills Selector */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#686C66]">
            <Sparkles className="w-3.5 h-3.5 text-[#C25E37]" />
            <span>Curate by Vibe & Experience</span>
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-xs font-medium text-[#C25E37] hover:text-[#9A4626] transition flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3 h-3" />
              Reset filters
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
          <button
            id="vibe-filter-all"
            onClick={() => onVibeChange('')}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
              !selectedVibe
                ? 'bg-[#181B1A] text-white shadow-xs'
                : 'bg-white text-[#555953] border border-[#DDD6CA] hover:bg-[#F3EFE7] hover:text-[#181B1A]'
            }`}
          >
            All Vibes
          </button>

          {VIBE_CATEGORIES.map((vibe) => {
            const isSelected = selectedVibe === vibe.label;
            return (
              <button
                key={vibe.id}
                id={`vibe-filter-${vibe.id}`}
                onClick={() => onVibeChange(isSelected ? '' : vibe.label)}
                className={`whitespace-nowrap inline-flex items-center px-3.5 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#114B3E] text-white shadow-xs ring-2 ring-[#114B3E]/20'
                    : 'bg-white text-[#4A4E48] border border-[#DDD6CA] hover:bg-[#FAF6EE] hover:text-[#181B1A]'
                }`}
                title={vibe.description}
              >
                <span>{vibe.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
