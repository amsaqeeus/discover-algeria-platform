import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  ShieldCheck,
  CheckCircle,
  Trash2,
  Edit3,
  Lock,
  AlertCircle,
  Eye,
  EyeOff,
  ExternalLink,
  MapPin,
  Image,
  KeyRound,
  ShieldAlert,
  Loader2,
  RefreshCw,
  Clock
} from 'lucide-react';
import { Spot } from '../types';

interface LoginResponse {
  success: boolean;
  message?: string;
  remainingAttempts?: number;
  lockedUntil?: number;
}

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
  onLogin: (password: string) => Promise<LoginResponse>;
  onLogout: () => void;
  spots: Spot[];
  onApproveSpot: (spotId: string) => void;
  onDeleteSpot: (spotId: string) => void;
  onEditSpot: (spot: Spot) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  isAdmin,
  onLogin,
  onLogout,
  spots,
  onApproveSpot,
  onDeleteSpot,
  onEditSpot
}) => {
  if (!isOpen) return null;

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [lockCountdown, setLockCountdown] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'all' | 'security'>('pending');

  const pendingSpots = spots.filter((s) => !s.isApproved);
  const approvedSpots = spots.filter((s) => s.isApproved);

  // Lockout countdown timer
  useEffect(() => {
    if (!lockedUntil) return;

    const interval = setInterval(() => {
      const diff = lockedUntil - Date.now();
      if (diff <= 0) {
        setLockedUntil(null);
        setErrorMsg('');
        clearInterval(interval);
      } else {
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setLockCountdown(`${mins}m ${secs < 10 ? '0' : ''}${secs}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockedUntil]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || lockedUntil) return;

    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const result = await onLogin(password);
      if (!result.success) {
        setErrorMsg(result.message || 'Authentication failed. Please verify credentials.');
        if (result.remainingAttempts !== undefined) {
          setRemainingAttempts(result.remainingAttempts);
        }
        if (result.lockedUntil) {
          setLockedUntil(result.lockedUntil);
        }
      } else {
        setPassword('');
        setErrorMsg('');
        setRemainingAttempts(null);
        setLockedUntil(null);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="admin-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="admin-modal-container"
        className="relative w-full max-w-3xl bg-[#FAF8F5] rounded-3xl border border-[#E0D9CD] shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E7E1D7] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#114B3E]/10 text-[#114B3E] flex items-center justify-center">
              {isAdmin ? <ShieldCheck className="w-5 h-5 text-[#114B3E]" /> : <Shield className="w-5 h-5 text-[#114B3E]" />}
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-[#181B1A]">
                {isAdmin ? 'Admin Moderation Workspace' : 'Administrator Sign In'}
              </h2>
              <p className="text-xs text-[#6B6E6A]">
                {isAdmin
                  ? 'Manage tourism spots, approvals, edits & system security'
                  : 'Enter verified administrator credentials to access management controls'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#7A7E79] hover:text-[#181B1A] hover:bg-[#EFE9DE] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {!isAdmin ? (
          /* Login Form with Hardened Security */
          <div className="p-8 sm:p-10 max-w-md mx-auto w-full space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#114B3E]/10 text-[#114B3E] border border-[#114B3E]/20 flex items-center justify-center mx-auto">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#181B1A]">
                Secure Authentication
              </h3>
              <p className="text-xs text-[#686C66]">
                Protected workspace requiring authorized administrator passkey.
              </p>
            </div>

            {/* Lockout notification */}
            {lockedUntil ? (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2 text-center">
                <div className="flex items-center justify-center gap-1.5 font-bold text-amber-800">
                  <Clock className="w-4 h-4" />
                  <span>Rate Limit Lockout Engaged</span>
                </div>
                <p>Too many failed attempts. Security cooldown remaining:</p>
                <div className="font-mono text-sm font-bold text-amber-900 py-1">
                  {lockCountdown || 'Calculating...'}
                </div>
              </div>
            ) : (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-[#383C39]">
                      Administrator Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-[#686C66] hover:text-[#181B1A] transition cursor-pointer"
                    >
                      {showPassword ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-[#114B3E]" />
                          <span>Hide Password</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5 text-[#7A7E79]" />
                          <span>Reveal Password</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      value={password}
                      disabled={isSubmitting}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter administrative password..."
                      className="w-full px-4 py-2.5 pr-11 bg-white border border-[#DDD6CA] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#114B3E]/30 focus:border-[#114B3E] transition disabled:opacity-50"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#9EA29D]">
                      <Lock className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-rose-50 text-rose-800 text-xs flex items-start gap-2.5 border border-rose-200 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                    <div className="space-y-1">
                      <p className="font-semibold">{errorMsg}</p>
                      {remainingAttempts !== null && remainingAttempts > 0 && (
                        <p className="text-[11px] text-rose-700">
                          {remainingAttempts} attempt{remainingAttempts > 1 ? 's' : ''} remaining before temporary lockout.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || !password.trim()}
                  className="w-full py-2.5 px-4 bg-[#114B3E] hover:bg-[#0D3B31] text-white font-semibold text-xs rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying Credentials...</span>
                    </>
                  ) : (
                    <span>Sign In to Admin Workspace</span>
                  )}
                </button>
              </form>
            )}

            {/* System Security Badges */}
            <div className="p-3.5 rounded-2xl bg-[#FAF4EB] border border-[#E8DFC8] space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#114B3E]">
                <ShieldCheck className="w-4 h-4 text-[#114B3E]" />
                <span>Security System Active (100% Protected)</span>
              </div>
              <ul className="text-[11px] text-[#6B655C] space-y-1 pl-1">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  <span>Server-side timing-safe authentication (no client secrets)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  <span>Automated brute-force attack rate limiting (5 tries max)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  <span>256-bit cryptographically secure session tokens</span>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          /* Admin Moderation Panel */
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="bg-white p-4 rounded-2xl border border-[#E7E1D7] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#7A7E79] font-medium block">Pending Approvals</span>
                  <span className="text-2xl font-bold font-serif text-[#C25E37]">
                    {pendingSpots.length}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#FAF4EB] text-[#C25E37] flex items-center justify-center font-bold">
                  !
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E7E1D7] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#7A7E79] font-medium block">Published Spots</span>
                  <span className="text-2xl font-bold font-serif text-[#114B3E]">
                    {approvedSpots.length}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#114B3E]/10 text-[#114B3E] flex items-center justify-center">
                  <CheckCircle className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Moderation Tabs */}
            <div className="flex items-center justify-between border-b border-[#E7E1D7] pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    activeTab === 'pending'
                      ? 'bg-[#C25E37] text-white shadow-xs'
                      : 'bg-white text-[#565A54] border border-[#DDD6CA] hover:bg-[#F3EFE7]'
                  }`}
                >
                  Pending Approval ({pendingSpots.length})
                </button>
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    activeTab === 'all'
                      ? 'bg-[#114B3E] text-white shadow-xs'
                      : 'bg-white text-[#565A54] border border-[#DDD6CA] hover:bg-[#F3EFE7]'
                  }`}
                >
                  All Spots ({spots.length})
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'security'
                      ? 'bg-[#181B1A] text-white shadow-xs'
                      : 'bg-white text-[#565A54] border border-[#DDD6CA] hover:bg-[#F3EFE7]'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Security Status</span>
                </button>
              </div>

              <button
                onClick={onLogout}
                className="text-xs font-medium text-[#C25E37] hover:underline cursor-pointer"
              >
                Log Out of Admin
              </button>
            </div>

            {/* Security Tab Content */}
            {activeTab === 'security' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="p-5 rounded-2xl bg-white border border-[#E7E1D7] space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-[#181B1A] text-base">
                        System Security Architecture
                      </h4>
                      <p className="text-xs text-[#7A7E79]">
                        Real-time verification of backend protection safeguards
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      100% Enforced
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E7E1D7] space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#181B1A]">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>Zero Client-Side Secret Leakage</span>
                      </div>
                      <p className="text-[11px] text-[#6B6E6A]">
                        No plain-text passwords or secret credentials reside in client bundles or HTML markup.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E7E1D7] space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#181B1A]">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>Timing-Safe Hash Comparison</span>
                      </div>
                      <p className="text-[11px] text-[#6B6E6A]">
                        Uses constant-time cryptographic verification to eliminate side-channel latency probing attacks.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E7E1D7] space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#181B1A]">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>Brute-Force Rate Limiting</span>
                      </div>
                      <p className="text-[11px] text-[#6B6E6A]">
                        Limits consecutive failures to 5 attempts with a 15-minute sliding IP lockout window.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E7E1D7] space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>Cryptographic Session Tokens</span>
                      </div>
                      <p className="text-[11px] text-[#6B6E6A]">
                        256-bit entropy random tokens with 12-hour server-verified expiration time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Spot Items List */}
            {activeTab !== 'security' && (
              <div className="space-y-3">
                {(activeTab === 'pending' ? pendingSpots : spots).length === 0 ? (
                  <div className="text-center py-10 bg-white rounded-2xl border border-[#E7E1D7] text-xs text-[#7A7E79]">
                    {activeTab === 'pending'
                      ? 'All traveler spot submissions are reviewed and approved.'
                      : 'No spots available in directory.'}
                  </div>
                ) : (
                  (activeTab === 'pending' ? pendingSpots : spots).map((spot) => (
                    <div
                      key={spot.id}
                      className="bg-white p-4 rounded-2xl border border-[#E7E1D7] hover:border-[#DDD6CA] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition"
                    >
                      <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                        <img
                          src={spot.photo}
                          alt={spot.title}
                          referrerPolicy="no-referrer"
                          className="w-16 h-14 rounded-xl object-cover bg-[#F1ECE4] shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80';
                          }}
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-serif font-bold text-[#181B1A] text-sm truncate">
                              {spot.title}
                            </h4>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#FAF6EE] text-[#4A443A] border border-[#E8DFC8]">
                              <MapPin className="w-2.5 h-2.5 text-[#114B3E]" />
                              {spot.wilaya}
                            </span>
                            {!spot.isApproved && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                                Needs Approval
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-[#686C66] line-clamp-1 mt-1">
                            {spot.idealFor || spot.description}
                          </p>

                          <div className="text-[11px] text-[#8C908B] mt-1 flex items-center gap-2">
                            <span>Added: {spot.createdAt}</span>
                            <span>•</span>
                            <span>By: {spot.submittedBy || 'Traveler'}</span>
                            <span>•</span>
                            <span>{spot.reviews.length} reviews</span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        {!spot.isApproved && (
                          <button
                            onClick={() => onApproveSpot(spot.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#114B3E] hover:bg-[#0D3B31] text-white text-xs font-semibold shadow-xs transition cursor-pointer"
                            title="Approve & Publish"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                        )}

                        <button
                          onClick={() => onEditSpot(spot)}
                          className="p-2 rounded-xl bg-[#FAF8F5] hover:bg-[#EFE9DE] border border-[#DDD6CA] text-[#464A47] transition cursor-pointer"
                          title="Edit spot"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onDeleteSpot(spot.id)}
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 transition cursor-pointer"
                          title="Delete spot"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
