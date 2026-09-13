import React, { useState } from 'react';
import {
  X,
  MapPin,
  Star,
  Navigation,
  ExternalLink,
  Calendar,
  DollarSign,
  User,
  Check,
  Send,
  Trash2,
  Sparkles,
  Clock
} from 'lucide-react';
import { Spot, Review } from '../types';
import { calculateAverageRating } from '../utils/storage';
import { sanitizeInput } from '../utils/security';

interface SpotDetailModalProps {
  spot: Spot | null;
  onClose: () => void;
  onAddReview: (spotId: string, review: Omit<Review, 'id' | 'createdAt'>) => void;
  isAdmin: boolean;
  onDeleteReview?: (spotId: string, reviewId: string) => void;
}

export const SpotDetailModal: React.FC<SpotDetailModalProps> = ({
  spot,
  onClose,
  onAddReview,
  isAdmin,
  onDeleteReview
}) => {
  if (!spot) return null;

  const { average, count } = calculateAverageRating(spot.reviews);

  // Review Form state
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [vibeFeedback, setVibeFeedback] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const handleCopyMapsLink = () => {
    if (spot.googleMapsUrl) {
      navigator.clipboard.writeText(spot.googleMapsUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleOpenMaps = () => {
    if (spot.googleMapsUrl) {
      window.open(spot.googleMapsUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) return;

    onAddReview(spot.id, {
      authorName: sanitizeInput(authorName),
      rating,
      comment: sanitizeInput(comment),
      vibeFeedback: sanitizeInput(vibeFeedback) || undefined
    });

    setAuthorName('');
    setComment('');
    setVibeFeedback('');
    setRating(5);
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  return (
    <div
      id="spot-detail-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl my-6 bg-[#FAF8F5] rounded-3xl border border-[#E0D9CD] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition cursor-pointer"
          title="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1 divide-y divide-[#EAE4D9]">
          {/* Hero Banner Image */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full bg-[#EADFD0] overflow-hidden">
            <img
              src={spot.photo}
              alt={spot.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#181B1A]/80 backdrop-blur-md text-[#FAF8F5]">
                  <MapPin className="w-3 h-3 text-[#E2B774]" />
                  <span>{spot.wilaya}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#D49757] text-white">
                  <Star className="w-3 h-3 fill-white" />
                  <span>{average} rating ({count} reviews)</span>
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                {spot.title}
              </h1>
            </div>
          </div>

          {/* Dossier Content Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Quick Metadata chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-3.5 rounded-2xl border border-[#E7E1D7] flex flex-col justify-center">
                <span className="text-[11px] font-semibold text-[#7A7E79] uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#114B3E]" />
                  Wilaya
                </span>
                <span className="font-semibold text-sm text-[#181B1A] truncate mt-0.5">
                  {spot.wilaya}
                </span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-[#E7E1D7] flex flex-col justify-center">
                <span className="text-[11px] font-semibold text-[#7A7E79] uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#114B3E]" />
                  Best Time
                </span>
                <span className="font-semibold text-sm text-[#181B1A] truncate mt-0.5" title={spot.bestTimeToVisit || 'Year-round'}>
                  {spot.bestTimeToVisit || 'Year-round'}
                </span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-[#E7E1D7] flex flex-col justify-center">
                <span className="text-[11px] font-semibold text-[#7A7E79] uppercase tracking-wider flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-[#114B3E]" />
                  Entry Fee
                </span>
                <span className="font-semibold text-sm text-[#181B1A] truncate mt-0.5">
                  {spot.entryFee || 'Free entry'}
                </span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-[#E7E1D7] flex flex-col justify-center">
                <span className="text-[11px] font-semibold text-[#7A7E79] uppercase tracking-wider flex items-center gap-1">
                  <User className="w-3 h-3 text-[#114B3E]" />
                  Shared By
                </span>
                <span className="font-semibold text-sm text-[#181B1A] truncate mt-0.5">
                  {spot.submittedBy || 'Algeria Explorer'}
                </span>
              </div>
            </div>

            {/* Vibes & Categories */}
            <div>
              <span className="text-xs font-semibold text-[#686C66] uppercase tracking-wider block mb-2">
                Atmosphere & Vibes:
              </span>
              <div className="flex flex-wrap gap-2">
                {spot.vibes.map((vibe, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-medium bg-[#FAF6EE] text-[#4A443A] border border-[#E8DFC8]"
                  >
                    {vibe}
                  </span>
                ))}
              </div>
            </div>

            {/* Spot Description */}
            <div className="space-y-2">
              <h3 className="font-serif font-bold text-lg text-[#181B1A]">
                About this Destination
              </h3>
              <p className="text-sm sm:text-base text-[#464A47] leading-relaxed font-normal whitespace-pre-line">
                {spot.description}
              </p>
            </div>

            {/* "Ideal For" Vibe Highlight Box */}
            {spot.idealFor && (
              <div className="bg-[#FAF4EB] rounded-2xl p-4 sm:p-5 border border-[#E6DBCE] space-y-1.5">
                <div className="flex items-center gap-2 text-[#C25E37] font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>The Vibe: Why is it ideal for travelers?</span>
                </div>
                <p className="text-xs sm:text-sm text-[#3E423F] italic leading-relaxed">
                  "{spot.idealFor}"
                </p>
              </div>
            )}

            {/* Google Maps Location & Directions Module */}
            <div className="p-5 rounded-2xl bg-white border border-[#E7E1D7] space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-[#114B3E]" />
                  <div>
                    <h4 className="font-bold text-sm text-[#181B1A]">Google Maps Directions</h4>
                    <p className="text-xs text-[#7A7E79]">Exact coordinates & navigation link</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyMapsLink}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#EFE9DE] border border-[#DDD6CA] text-xs font-medium text-[#464A47] transition cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <ExternalLink className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
                  </button>

                  <button
                    onClick={handleOpenMaps}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#114B3E] hover:bg-[#0D3B31] text-white text-xs font-semibold shadow-xs transition cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Open in Google Maps</span>
                  </button>
                </div>
              </div>

              {spot.googleMapsUrl && (
                <div className="text-[11px] text-[#7A7E79] font-mono bg-[#FAF8F5] p-2.5 rounded-xl truncate border border-[#EAE4D9]">
                  {spot.googleMapsUrl}
                </div>
              )}
            </div>
          </div>

          {/* Traveler Reviews & Ratings Module */}
          <div className="p-6 sm:p-8 space-y-6 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#181B1A]">
                  Traveler Reviews & Experiences
                </h3>
                <p className="text-xs text-[#7A7E79]">
                  Community ratings and firsthand relaxation notes
                </p>
              </div>

              <div className="flex items-center gap-2 bg-[#FAF8F5] px-3.5 py-2 rounded-xl border border-[#E7E1D7]">
                <div className="flex items-center text-[#D49757]">
                  <Star className="w-4 h-4 fill-[#D49757]" />
                </div>
                <span className="font-bold text-sm text-[#181B1A]">{average} / 5</span>
                <span className="text-xs text-[#7A7E79]">({count})</span>
              </div>
            </div>

            {/* Add Review Form */}
            <form onSubmit={handleSubmitReview} className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#E7E1D7] space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#60645E]">
                Share your experience & rate this spot
              </h4>

              {reviewSubmitted && (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Your review was added successfully. Thank you for helping other travelers.</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#464A47] mb-1">
                    Your Name:
                  </label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. Amina from Constantine"
                    className="w-full px-3.5 py-2 bg-white border border-[#DDD6CA] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#114B3E]/30 focus:border-[#114B3E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#464A47] mb-1">
                    Your Rating:
                  </label>
                  <div className="flex items-center gap-1.5 pt-1">
                    {[1, 2, 3, 4, 5].map((starVal) => {
                      const isFilled = starVal <= (hoverRating !== null ? hoverRating : rating);
                      return (
                        <button
                          key={starVal}
                          type="button"
                          onMouseEnter={() => setHoverRating(starVal)}
                          onMouseLeave={() => setHoverRating(null)}
                          onClick={() => setRating(starVal)}
                          className="p-1 text-stone-300 hover:scale-115 transition cursor-pointer"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              isFilled ? 'fill-[#D49757] text-[#D49757]' : 'text-stone-300'
                            }`}
                          />
                        </button>
                      );
                    })}
                    <span className="text-xs font-bold text-[#181B1A] ml-2">
                      {hoverRating !== null ? hoverRating : rating} of 5
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#464A47] mb-1">
                  How was your experience? (peaceful, crowded, best times, views):
                </label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Describe your visit... Was it peaceful? Did you enjoy relaxing there?"
                  className="w-full px-3.5 py-2 bg-white border border-[#DDD6CA] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#114B3E]/30 focus:border-[#114B3E]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#464A47] mb-1">
                  Vibe Confirmation (Optional):
                </label>
                <input
                  type="text"
                  value={vibeFeedback}
                  onChange={(e) => setVibeFeedback(e.target.value)}
                  placeholder="e.g. 100% serene and calm for reading"
                  className="w-full px-3.5 py-2 bg-white border border-[#DDD6CA] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#114B3E]/30 focus:border-[#114B3E]"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#114B3E] hover:bg-[#0D3B31] text-white text-xs font-semibold shadow-xs transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Review</span>
                </button>
              </div>
            </form>

            {/* Existing Reviews List */}
            <div className="space-y-3.5">
              {spot.reviews.length === 0 ? (
                <div className="text-center py-6 text-xs text-[#7A7E79]">
                  No reviews yet. Be the first traveler to share your experience!
                </div>
              ) : (
                spot.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E7E1D7] space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#181B1A]">{rev.authorName}</span>
                        <span className="text-stone-300">•</span>
                        <div className="flex items-center text-[#D49757]">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < rev.rating
                                  ? 'fill-[#D49757] text-[#D49757]'
                                  : 'text-stone-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[#8C908B] text-[11px]">{rev.createdAt}</span>
                        {isAdmin && onDeleteReview && (
                          <button
                            onClick={() => onDeleteReview(spot.id, rev.id)}
                            className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer"
                            title="Delete review (Admin)"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-[#464A47] leading-relaxed">{rev.comment}</p>

                    {rev.vibeFeedback && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FAF4EB] text-[#C25E37] text-[11px] font-medium border border-[#E8DFC8]">
                        <Sparkles className="w-3 h-3 text-[#C25E37]" />
                        <span>Vibe note:</span>
                        <span className="text-[#383C39]">{rev.vibeFeedback}</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
