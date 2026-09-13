import React, { useState, useEffect, useMemo } from 'react';
import {
  Compass,
  MapPin,
  Sparkles,
  Search,
  PlusCircle,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  ThumbsUp,
  Heart,
  Calendar,
  Layers,
  Info,
  SlidersHorizontal,
  Globe2,
  Trees,
  SunMedium,
  Lock
} from 'lucide-react';
import { Spot, Review } from './types';
import {
  loadSpots,
  saveSpots,
  getAdminToken,
  setAdminToken,
  calculateAverageRating
} from './utils/storage';
import { apiLogin, apiVerifyToken, apiLogout, LoginResult } from './utils/security';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { SpotCard } from './components/SpotCard';
import { SpotDetailModal } from './components/SpotDetailModal';
import { AddSpotModal } from './components/AddSpotModal';
import { AdminModal } from './components/AdminModal';
import { EditSpotModal } from './components/EditSpotModal';
import { BrandLogo } from './components/BrandLogo';

export default function App() {
  const [spots, setSpots] = useState<Spot[]>(() => loadSpots());
  const [isAdmin, setIsAdmin] = useState<boolean>(() => Boolean(getAdminToken()));

  // Modals state
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [editingSpot, setEditingSpot] = useState<Spot | null>(null);

  // Filters & Sorting state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedWilaya, setSelectedWilaya] = useState<string>('');
  const [selectedVibe, setSelectedVibe] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('highest_rated');
  const [adminViewFilter, setAdminViewFilter] = useState<'all' | 'approved' | 'pending'>('approved');

  // Feedback toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  // Sync spots to storage whenever they change
  useEffect(() => {
    saveSpots(spots);
  }, [spots]);

  // Verify server session token validity on application mount
  useEffect(() => {
    const token = getAdminToken();
    if (token) {
      apiVerifyToken(token).then((isValid) => {
        if (isValid) {
          setIsAdmin(true);
        } else {
          setAdminToken(null);
          setIsAdmin(false);
        }
      });
    } else {
      setIsAdmin(false);
    }
  }, []);

  // Secure server-side login handler
  const handleAdminLogin = async (password: string): Promise<LoginResult> => {
    const result = await apiLogin(password);
    if (result.success && result.token) {
      setIsAdmin(true);
      setAdminToken(result.token);
      showToast('Welcome Admin! Authenticated via 256-bit encrypted session.');
      return { success: true };
    }
    return result;
  };

  // Secure server-side logout handler
  const handleAdminLogout = async () => {
    const token = getAdminToken();
    await apiLogout(token);
    setIsAdmin(false);
    setAdminToken(null);
    setAdminViewFilter('approved');
    showToast('Logged out of Admin mode. Session invalidated.');
  };

  // Admin and Spot CRUD operations
  const handleAddSpot = (newSpotData: Omit<Spot, 'id' | 'createdAt' | 'reviews'>) => {
    const newSpot: Spot = {
      ...newSpotData,
      id: `spot-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString().split('T')[0],
      reviews: []
    };

    setSpots((prev) => [newSpot, ...prev]);
    showToast(
      isAdmin
        ? `"${newSpot.title}" has been published directly!`
        : `"${newSpot.title}" submitted! It will appear once approved by admin.`
    );
  };

  const handleSaveEditedSpot = (updatedSpot: Spot) => {
    setSpots((prev) => prev.map((s) => (s.id === updatedSpot.id ? updatedSpot : s)));
    if (selectedSpot && selectedSpot.id === updatedSpot.id) {
      setSelectedSpot(updatedSpot);
    }
    showToast(`Spot "${updatedSpot.title}" updated.`);
  };

  const handleDeleteSpot = (spotId: string) => {
    setSpots((prev) => prev.filter((s) => s.id !== spotId));
    if (selectedSpot && selectedSpot.id === spotId) {
      setSelectedSpot(null);
    }
    showToast('Spot deleted.');
  };

  const handleApproveSpot = (spotId: string) => {
    setSpots((prev) =>
      prev.map((s) => (s.id === spotId ? { ...s, isApproved: true } : s))
    );
    showToast('Spot approved and published for all travelers.');
  };

  const handleToggleApproval = (spotId: string) => {
    setSpots((prev) =>
      prev.map((s) => {
        if (s.id === spotId) {
          const nextStatus = !s.isApproved;
          showToast(nextStatus ? 'Spot marked as Approved.' : 'Spot set to Pending review.');
          return { ...s, isApproved: nextStatus };
        }
        return s;
      })
    );
  };

  const handleAddReview = (spotId: string, reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setSpots((prev) =>
      prev.map((s) => {
        if (s.id === spotId) {
          const updated = {
            ...s,
            reviews: [newReview, ...s.reviews]
          };
          if (selectedSpot && selectedSpot.id === spotId) {
            setSelectedSpot(updated);
          }
          return updated;
        }
        return s;
      })
    );

    showToast('Thank you! Your experience & review have been posted.');
  };

  const handleDeleteReview = (spotId: string, reviewId: string) => {
    setSpots((prev) =>
      prev.map((s) => {
        if (s.id === spotId) {
          const updated = {
            ...s,
            reviews: s.reviews.filter((r) => r.id !== reviewId)
          };
          if (selectedSpot && selectedSpot.id === spotId) {
            setSelectedSpot(updated);
          }
          return updated;
        }
        return s;
      })
    );
    showToast('Review removed by admin.');
  };

  // Pending spots count
  const pendingSpotsCount = useMemo(() => {
    return spots.filter((s) => !s.isApproved).length;
  }, [spots]);

  // Filtered & Sorted spots
  const filteredSpots = useMemo(() => {
    return spots
      .filter((spot) => {
        // Admin approval filter
        if (isAdmin) {
          if (adminViewFilter === 'approved' && !spot.isApproved) return false;
          if (adminViewFilter === 'pending' && spot.isApproved) return false;
        } else {
          // Public users only see approved spots
          if (!spot.isApproved) return false;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = spot.title.toLowerCase().includes(q);
          const matchDesc = spot.description.toLowerCase().includes(q);
          const matchWilaya = spot.wilaya.toLowerCase().includes(q);
          const matchIdeal = spot.idealFor.toLowerCase().includes(q);
          const matchVibes = spot.vibes.some((v) => v.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchWilaya && !matchIdeal && !matchVibes) {
            return false;
          }
        }

        // Wilaya filter
        if (selectedWilaya && spot.wilaya !== selectedWilaya) {
          return false;
        }

        // Vibe filter
        if (selectedVibe && !spot.vibes.includes(selectedVibe)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'highest_rated') {
          const rateA = calculateAverageRating(a.reviews).average;
          const rateB = calculateAverageRating(b.reviews).average;
          return rateB - rateA;
        }
        if (sortBy === 'most_reviews') {
          return b.reviews.length - a.reviews.length;
        }
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return 0;
      });
  }, [spots, isAdmin, adminViewFilter, searchQuery, selectedWilaya, selectedVibe, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1F2322]">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="toast-notification"
          className="fixed bottom-6 right-6 z-50 bg-[#181B1A] text-[#FAF8F5] px-4 py-3 rounded-2xl shadow-xl border border-[#343836] text-xs sm:text-sm font-medium flex items-center gap-2.5 transition-all animate-bounce-short"
        >
          <CheckCircle2 className="w-4 h-4 text-[#86C47A] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navigation Header with Logo */}
      <Header
        isAdmin={isAdmin}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onAdminLogout={handleAdminLogout}
        pendingCount={pendingSpotsCount}
      />

      {/* Editorial Hero Section */}
      <section className="relative overflow-hidden bg-[#FAF6EE] border-b border-[#E7E1D7] pt-10 pb-12 sm:pt-16 sm:pb-18 px-4 sm:px-6 lg:px-8">
        {/* Subtle geometric backdrop pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#114B3E 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Main Editorial Copy */}
            <div className="lg:col-span-8 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#114B3E]/10 border border-[#114B3E]/20 text-[#114B3E] text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#C25E37]" />
                <span>The Algeria Travel & Vibe Index</span>
                <span className="text-[#8C908B]">•</span>
                <span className="font-arabic font-normal text-xs text-[#114B3E]">اكتشف أماكن الجزائر</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-[#181B1A] tracking-tight leading-[1.12]">
                Uncover Peaceful Parks, Views & Hidden Spots Across Algeria
              </h1>

              <p className="text-[#4E524E] text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl font-normal">
                Found a quiet botanical alley in Algiers, an ancient Roman pine grove in Tipaza, a sunset cliff in Oran, or tranquil dunes in Béchar?
                Explore destinations by their true atmosphere, get direct Google Maps navigation, and read honest traveler ratings.
              </p>

              {/* Curated Wilaya Quick Pills */}
              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-[#7A7E79] font-medium mr-1">Popular regions:</span>
                {[
                  { name: 'Algiers (Alger)', label: 'Algiers • الجزائر' },
                  { name: 'Tipaza', label: 'Tipaza • تيبازة' },
                  { name: 'Oran', label: 'Oran • وهران' },
                  { name: 'Constantine', label: 'Constantine • قسنطينة' },
                  { name: 'Béchar', label: 'Taghit Dunes • تاغيث' },
                  { name: 'Béjaïa', label: 'Cap Carbon • بجاية' }
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      setSelectedWilaya(item.name);
                      const el = document.getElementById('filter-bar-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-3 py-1.5 rounded-full bg-white hover:bg-[#FAF8F5] border border-[#DDD6CA] text-[#4A4E48] hover:text-[#114B3E] font-medium transition cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Editorial Showcase Card */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-3xl p-6 border border-[#E7E1D7] shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#EFE9DE]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#114B3E]" />
                    <span className="font-serif font-bold text-sm text-[#181B1A]">
                      Vibe Philosophy
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C25E37]">
                    100% Traveler-Led
                  </span>
                </div>

                <p className="text-xs text-[#555953] leading-relaxed">
                  Every spot in this directory features a firsthand <strong className="text-[#181B1A]">"Ideal For"</strong> relaxation diagnosis so you know if it's quiet enough for reading, scenic for sunset reflection, or suited for family rest.
                </p>

                <div className="space-y-2 pt-1 text-xs">
                  <div className="flex items-center gap-2.5 text-[#3A3D39]">
                    <Navigation className="w-4 h-4 text-[#114B3E] shrink-0" />
                    <span>Exact Google Maps directions link</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[#3A3D39]">
                    <Trees className="w-4 h-4 text-[#114B3E] shrink-0" />
                    <span>Parks, gardens, ruins & coastal viewpoints</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[#3A3D39]">
                    <ThumbsUp className="w-4 h-4 text-[#114B3E] shrink-0" />
                    <span>Reviews & ratings by fellow explorers</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="w-full py-2.5 px-4 bg-[#114B3E] hover:bg-[#0D3B31] text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Share a peaceful spot you know</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Explorer Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search & Vibe Filter Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedWilaya={selectedWilaya}
          onWilayaChange={setSelectedWilaya}
          selectedVibe={selectedVibe}
          onVibeChange={setSelectedVibe}
          sortBy={sortBy}
          onSortChange={setSortBy}
          adminViewFilter={adminViewFilter}
          onAdminViewFilterChange={setAdminViewFilter}
          isAdmin={isAdmin}
          totalSpotsCount={spots.filter((s) => s.isApproved).length}
          pendingCount={pendingSpotsCount}
        />

        {/* Spots Results Header */}
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#E7E1D7]">
          <div className="flex items-baseline gap-2.5">
            <h2 className="font-serif text-2xl font-bold text-[#181B1A]">
              {selectedVibe ? `${selectedVibe}` : selectedWilaya ? `Spots in ${selectedWilaya}` : 'Explore Algeria Spots'}
            </h2>
            <span className="text-xs font-semibold text-[#7A7E79]">
              ({filteredSpots.length} {filteredSpots.length === 1 ? 'curated place' : 'curated places'})
            </span>
          </div>

          <button
            id="main-share-spot-inline-btn"
            onClick={() => setIsAddModalOpen(true)}
            className="text-xs font-semibold text-[#114B3E] hover:text-[#0D3B31] flex items-center gap-1.5 cursor-pointer transition hover:underline"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add a new spot</span>
          </button>
        </div>

        {/* Spot Cards Grid */}
        {filteredSpots.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#DDD6CA] p-8 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FAF6EE] text-[#114B3E] flex items-center justify-center mx-auto border border-[#E8DFC8]">
              <Compass className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-xl font-bold text-[#181B1A]">
                No matching spots found
              </h3>
              <p className="text-xs sm:text-sm text-[#686C66] max-w-md mx-auto">
                No spots matched your current search filters or wilaya. Try picking a different vibe or reset your filters.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedWilaya('');
                  setSelectedVibe('');
                }}
                className="px-4 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#EFE9DE] border border-[#DDD6CA] text-[#4A4E48] text-xs font-semibold transition cursor-pointer"
              >
                Reset All Filters
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#114B3E] hover:bg-[#0D3B31] text-white text-xs font-semibold transition cursor-pointer"
              >
                + Share This Spot
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredSpots.map((spot) => (
              <SpotCard
                key={spot.id}
                spot={spot}
                onSelect={(s) => setSelectedSpot(s)}
                isAdmin={isAdmin}
                onEdit={(s) => setEditingSpot(s)}
                onDelete={handleDeleteSpot}
                onToggleApproval={handleToggleApproval}
              />
            ))}
          </div>
        )}
      </main>

      {/* Editorial Footer */}
      <footer className="mt-20 bg-[#F5EFE6] border-t border-[#E7E1D7] py-12 px-4 sm:px-6 lg:px-8 text-xs text-[#5E625D]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <BrandLogo
            size="sm"
            showSubtitle={true}
          />

          <div className="text-center md:text-right space-y-1">
            <p className="text-[#3A3E39] font-medium">
              Discover Algeria • Community Tourist & Vibe Directory
            </p>
            <p className="text-[#7A7E79]">
              Documenting peaceful parks, scenic vistas, and cultural spots with Google Maps navigation across all 58 Wilayas.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {!isAdmin ? (
              <button
                id="footer-admin-login-btn"
                onClick={() => setIsAdminModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-white text-[#114B3E] hover:text-[#0D3B31] font-medium border border-[#E0D9CD] transition shadow-2xs cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-[#114B3E]" />
                <span>Admin Portal</span>
              </button>
            ) : (
              <span className="inline-flex items-center gap-1 text-[#114B3E] font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Active</span>
              </span>
            )}
          </div>
        </div>
      </footer>

      {/* Spot Detail & Review Modal */}
      <SpotDetailModal
        spot={selectedSpot}
        onClose={() => setSelectedSpot(null)}
        onAddReview={handleAddReview}
        isAdmin={isAdmin}
        onDeleteReview={handleDeleteReview}
      />

      {/* Add New Spot Modal */}
      <AddSpotModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddSpot={handleAddSpot}
        isAdmin={isAdmin}
      />

      {/* Admin Authentication & Moderation Modal */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        isAdmin={isAdmin}
        onLogin={handleAdminLogin}
        onLogout={handleAdminLogout}
        spots={spots}
        onApproveSpot={handleApproveSpot}
        onDeleteSpot={handleDeleteSpot}
        onEditSpot={(s) => setEditingSpot(s)}
      />

      {/* Edit Spot Modal (Admin) */}
      <EditSpotModal
        spot={editingSpot}
        isOpen={Boolean(editingSpot)}
        onClose={() => setEditingSpot(null)}
        onSaveSpot={handleSaveEditedSpot}
      />
    </div>
  );
}
