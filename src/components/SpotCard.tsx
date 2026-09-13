import React from 'react';
import { MapPin, Star, Navigation, ExternalLink, Edit3, Trash2, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { Spot } from '../types';
import { calculateAverageRating } from '../utils/storage';

interface SpotCardProps {
  spot: Spot;
  onSelect: (spot: Spot) => void;
  isAdmin: boolean;
  onEdit?: (spot: Spot) => void;
  onDelete?: (spotId: string) => void;
  onToggleApproval?: (spotId: string) => void;
}

export const SpotCard: React.FC<SpotCardProps> = ({
  spot,
  onSelect,
  isAdmin,
  onEdit,
  onDelete,
  onToggleApproval
}) => {
  const { average, count } = calculateAverageRating(spot.reviews);

  const handleOpenMaps = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (spot.googleMapsUrl) {
      window.open(spot.googleMapsUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <article
      id={`spot-card-${spot.id}`}
      onClick={() => onSelect(spot)}
      className="group relative bg-white rounded-[28px] p-3 sm:p-3.5 border border-[#E7DFD3] hover:border-[#114B3E]/40 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(17,75,62,0.09)] transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      <div className="space-y-4">
        {/* Inset Rounded Photo Container */}
        <div className="relative aspect-[16/11] w-full rounded-[22px] overflow-hidden bg-[#F0EBE1] shadow-xs">
          <img
            src={spot.photo}
            alt={spot.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';
            }}
          />

          {/* Gradient protection overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-black/25 pointer-events-none" />

          {/* Top Floating Badge with Status Indicator Dot */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/92 backdrop-blur-md text-xs font-semibold text-[#181B1A] shadow-xs border border-white/60">
              <span className="w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-emerald-200/80 shrink-0" />
              <span className="tracking-tight">{spot.wilaya}</span>
            </div>

            {/* Google Maps Quick Link */}
            <button
              id={`map-btn-${spot.id}`}
              onClick={handleOpenMaps}
              title="Open location in Google Maps"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#181B1A]/80 hover:bg-[#181B1A] text-white text-[11px] font-medium backdrop-blur-md transition-all border border-white/20 shadow-xs cursor-pointer hover:scale-105 active:scale-95"
            >
              <Navigation className="w-3 h-3 text-[#E2B774]" />
              <span>Maps</span>
              <ExternalLink className="w-2.5 h-2.5 text-white/70" />
            </button>
          </div>

          {/* Admin Status Badge */}
          {isAdmin && (
            <div className="absolute bottom-3 left-3">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-xs ${
                  spot.isApproved
                    ? 'bg-[#114B3E]/95 text-emerald-100 ring-1 ring-emerald-400/40'
                    : 'bg-[#C25E37]/95 text-amber-100 ring-1 ring-amber-300/40'
                }`}
              >
                {spot.isApproved ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approved</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-3.5 h-3.5" />
                    <span>Pending Review</span>
                  </>
                )}
              </span>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="px-2 sm:px-2.5 space-y-3">
          {/* Metadata Row: Rating & Fee */}
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF5EC] border border-[#E9DFC8] text-xs">
              <Star className="w-3.5 h-3.5 fill-[#D49757] text-[#D49757]" />
              <span className="font-bold text-[#181B1A]">{average}</span>
              <span className="text-[#7A7E79]">({count} {count === 1 ? 'review' : 'reviews'})</span>
            </div>

            {spot.entryFee && (
              <span className="text-[11px] font-medium text-[#686C66] bg-[#F3EFE7] px-2.5 py-1 rounded-full border border-[#E4DDD0]">
                {spot.entryFee}
              </span>
            )}
          </div>

          {/* Title and Editorial Subtitle Pair */}
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-[#181B1A] text-xl sm:text-[22px] leading-tight group-hover:text-[#114B3E] transition-colors line-clamp-1">
              {spot.title}
            </h3>
            <p className="font-serif italic text-sm text-[#114B3E] font-medium line-clamp-1">
              {spot.idealFor || 'Authentic Algerian Destination'}
            </p>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#555954] line-clamp-2 leading-relaxed font-normal">
            {spot.description}
          </p>

          {/* Vibe Chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {spot.vibes.slice(0, 3).map((vibe, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#FAF6EE] text-[#4A4E48] border border-[#E8DFC8]"
              >
                {vibe}
              </span>
            ))}
            {spot.vibes.length > 3 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#F1ECE4] text-[#696C68] border border-[#E2DBD0]">
                +{spot.vibes.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Action Area */}
      <div className="px-2 sm:px-2.5 pt-4">
        {isAdmin ? (
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onSelect(spot)}
              className="flex-1 py-2.5 px-4 rounded-full bg-[#114B3E] hover:bg-[#0D3B31] text-white text-xs font-semibold tracking-wide transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              id={`admin-approve-btn-${spot.id}`}
              onClick={() => onToggleApproval?.(spot.id)}
              className={`p-2.5 rounded-full border text-xs transition cursor-pointer ${
                spot.isApproved
                  ? 'bg-[#F3EFE7] border-[#DCD5C9] text-[#555855] hover:bg-[#EAE4D9]'
                  : 'bg-[#114B3E] text-white border-[#0D3B31] hover:bg-[#0D3B31]'
              }`}
              title={spot.isApproved ? 'Mark as Pending' : 'Approve Spot'}
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>

            <button
              id={`admin-edit-btn-${spot.id}`}
              onClick={() => onEdit?.(spot)}
              className="p-2.5 rounded-full bg-[#F3EFE7] hover:bg-[#EAE4D9] text-[#343836] border border-[#DCD5C9] transition cursor-pointer"
              title="Edit Spot details"
            >
              <Edit3 className="w-4 h-4" />
            </button>

            <button
              id={`admin-delete-btn-${spot.id}`}
              onClick={() => onDelete?.(spot.id)}
              className="p-2.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition cursor-pointer"
              title="Delete Spot"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(spot);
            }}
            className="w-full py-3 px-5 rounded-full bg-[#114B3E] hover:bg-[#0D3B31] text-white text-xs sm:text-sm font-semibold tracking-wide shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer group/btn active:scale-[0.99]"
          >
            <span>Explore Destination</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
          </button>
        )}
      </div>
    </article>
  );
};

