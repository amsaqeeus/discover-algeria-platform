import React, { useState } from 'react';
import { X, Upload, MapPin, Navigation, Sparkles, Check, Link as LinkIcon, Info } from 'lucide-react';
import { Spot } from '../types';
import { ALGERIA_WILAYAS, VIBE_CATEGORIES } from '../data/wilayasAndVibes';
import { sanitizeInput, isValidUrl } from '../utils/security';

interface AddSpotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSpot: (spot: Omit<Spot, 'id' | 'createdAt' | 'reviews'>) => void;
  isAdmin: boolean;
}

const PRESET_PHOTOS = [
  {
    label: 'Peaceful Botanical Garden',
    url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80'
  },
  {
    label: 'Mediterranean Coast & Pine',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
  },
  {
    label: 'Golden Sahara Dunes',
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80'
  },
  {
    label: 'Ancient Heritage & Fortress',
    url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80'
  },
  {
    label: 'Mountain Cliffs & Canyons',
    url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80'
  }
];

export const AddSpotModal: React.FC<AddSpotModalProps> = ({
  isOpen,
  onClose,
  onAddSpot,
  isAdmin
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [wilaya, setWilaya] = useState('Algiers (Alger)');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [selectedVibes, setSelectedVibes] = useState<string[]>(['Ideal for Relaxing', 'Peaceful Park & Gardens']);
  const [idealFor, setIdealFor] = useState('');
  const [bestTimeToVisit, setBestTimeToVisit] = useState('');
  const [entryFee, setEntryFee] = useState('');
  const [submittedBy, setSubmittedBy] = useState('');
  const [previewError, setPreviewError] = useState(false);

  const toggleVibe = (vibeLabel: string) => {
    setSelectedVibes((prev) =>
      prev.includes(vibeLabel)
        ? prev.filter((v) => v !== vibeLabel)
        : [...prev, vibeLabel]
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPhotoUrl(reader.result);
          setPreviewError(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedWilayaObj = ALGERIA_WILAYAS.find((w) => w.name === wilaya);
    const wilayaCode = selectedWilayaObj?.code;

    const fallbackPhoto =
      photoUrl.trim() ||
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80';

    const safeTitle = sanitizeInput(title);
    const safeDesc = sanitizeInput(description);
    const safeIdeal = sanitizeInput(idealFor);
    const safeBestTime = sanitizeInput(bestTimeToVisit);
    const safeEntry = sanitizeInput(entryFee);
    const safeAuthor = sanitizeInput(submittedBy);

    let safeMaps = googleMapsUrl.trim();
    if (!safeMaps || !isValidUrl(safeMaps)) {
      safeMaps = `https://maps.google.com/?q=${encodeURIComponent(safeTitle + ' ' + wilaya + ' Algeria')}`;
    }

    let safePhoto = fallbackPhoto;
    if (!isValidUrl(safePhoto)) {
      safePhoto = 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80';
    }

    onAddSpot({
      title: safeTitle,
      wilaya,
      wilayaCode,
      description: safeDesc,
      photo: safePhoto,
      googleMapsUrl: safeMaps,
      vibes: selectedVibes.length > 0 ? selectedVibes : ['Ideal for Relaxing'],
      idealFor: safeIdeal || 'Peaceful contemplation and relaxing in Algeria.',
      bestTimeToVisit: safeBestTime || undefined,
      entryFee: safeEntry || undefined,
      submittedBy: safeAuthor || undefined,
      isApproved: isAdmin // If admin creates it, auto-approve; otherwise user submissions go to pending for admin
    });

    onClose();
  };

  return (
    <div
      id="add-spot-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-[#FAF8F5] rounded-3xl border border-[#E0D9CD] shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E7E1D7] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#114B3E]/10 text-[#114B3E] flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[#114B3E]" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-[#181B1A]">
                Share a Good Spot in Algeria
              </h2>
              <p className="text-xs text-[#6B6E6A]">
                Help travelers discover peaceful gardens, viewpoints & hidden places
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

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Title & Wilaya */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-7">
              <label className="block font-semibold text-[#383C39] mb-1.5">
                Spot Name / Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Belvédère des Pins or Jardin d'Essai"
                className="w-full px-3.5 py-2.5 bg-white border border-[#DDD6CA] rounded-xl text-xs sm:text-sm text-[#181B1A] focus:outline-none focus:ring-2 focus:ring-[#114B3E]/30 focus:border-[#114B3E]"
              />
            </div>

            <div className="sm:col-span-5">
              <label className="block font-semibold text-[#383C39] mb-1.5">
                Wilaya (Province) *
              </label>
              <select
                value={wilaya}
                onChange={(e) => setWilaya(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#DDD6CA] rounded-xl text-xs sm:text-sm text-[#181B1A] focus:outline-none focus:ring-2 focus:ring-[#114B3E]/30 focus:border-[#114B3E]"
              >
                {ALGERIA_WILAYAS.map((w) => (
                  <option key={w.code} value={w.name}>
                    {w.code} - {w.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-[#383C39] mb-1.5">
              Describe this spot *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What makes this place special? Describe the trees, shade, atmosphere, fountains, quiet corners, or views..."
              className="w-full px-3.5 py-2.5 bg-white border border-[#DDD6CA] rounded-xl text-xs sm:text-sm text-[#181B1A] focus:outline-none focus:ring-2 focus:ring-[#114B3E]/30 focus:border-[#114B3E]"
            />
          </div>

          {/* Vibe Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-semibold text-[#383C39]">
                What vibe does this spot give? (Select all that apply) *
              </label>
              <span className="text-[#8C908B] text-[11px]">
                {selectedVibes.length} selected
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {VIBE_CATEGORIES.map((vibe) => {
                const active = selectedVibes.includes(vibe.label);
                return (
                  <button
                    key={vibe.id}
                    type="button"
                    onClick={() => toggleVibe(vibe.label)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                      active
                        ? 'bg-[#114B3E] text-white shadow-xs'
                        : 'bg-white text-[#4D514E] border border-[#DDD6CA] hover:bg-[#F3EFE7]'
                    }`}
                  >
                    <span>{vibe.label}</span>
                    {active && <Check className="w-3 h-3 text-emerald-200" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* "Ideal For" Vibe Explanatory note */}
          <div>
            <label className="block font-semibold text-[#383C39] mb-1.5">
              Why is this spot ideal for relaxing / travelers? (Vibe Details) *
            </label>
            <input
              type="text"
              required
              value={idealFor}
              onChange={(e) => setIdealFor(e.target.value)}
              placeholder="e.g. Perfect for relaxing under tall shade trees with a book, morning tea, or listening to water fountains"
              className="w-full px-3.5 py-2.5 bg-white border border-[#DDD6CA] rounded-xl text-xs sm:text-sm text-[#181B1A] focus:outline-none focus:ring-2 focus:ring-[#114B3E]/30 focus:border-[#114B3E]"
            />
          </div>

          {/* Google Maps Link */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-[#383C39] flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-[#114B3E]" />
                Google Maps Link or Location URL
              </label>
              <span className="text-[11px] text-[#8C908B]">
                (Allows other travelers to open directions directly)
              </span>
            </div>
            <input
              type="url"
              value={googleMapsUrl}
              onChange={(e) => setGoogleMapsUrl(e.target.value)}
              placeholder="https://maps.google.com/?q=..."
              className="w-full px-3.5 py-2.5 bg-white border border-[#DDD6CA] rounded-xl text-xs sm:text-sm text-[#181B1A] focus:outline-none focus:ring-2 focus:ring-[#114B3E]/30 focus:border-[#114B3E]"
            />
          </div>

          {/* Photo URL or Upload */}
          <div>
            <label className="block font-semibold text-[#383C39] mb-1.5">
              Spot Photo (Image URL or Upload) *
            </label>
            <div className="space-y-3">
              <input
                type="url"
                value={photoUrl.startsWith('data:') ? '[Uploaded Image File]' : photoUrl}
                disabled={photoUrl.startsWith('data:')}
                onChange={(e) => {
                  setPhotoUrl(e.target.value);
                  setPreviewError(false);
                }}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2.5 bg-white border border-[#DDD6CA] rounded-xl text-xs sm:text-sm text-[#181B1A] focus:outline-none focus:ring-2 focus:ring-[#114B3E]/30 focus:border-[#114B3E]"
              />

              <div className="flex items-center gap-3">
                <label
                  htmlFor="spot-upload-input"
                  className="inline-flex items-center gap-2 px-3 py-2 bg-white hover:bg-[#F3EFE7] border border-dashed border-[#C5BCAD] rounded-xl text-xs font-medium text-[#4A4E4A] transition cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-[#114B3E]" />
                  <span>Upload photo from device</span>
                </label>
                <input
                  id="spot-upload-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />

                {photoUrl && (
                  <button
                    type="button"
                    onClick={() => setPhotoUrl('')}
                    className="text-xs text-[#C25E37] hover:underline"
                  >
                    Clear photo
                  </button>
                )}
              </div>

              {/* Preset Sample Photos */}
              <div>
                <span className="text-[11px] text-[#7A7E79] font-medium block mb-1.5">
                  Or pick a beautiful curated Algerian preset photo:
                </span>
                <div className="flex flex-wrap gap-2">
                  {PRESET_PHOTOS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setPhotoUrl(preset.url);
                        setPreviewError(false);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white border border-[#DDD6CA] hover:bg-[#F3EFE7] text-[11px] text-[#4A4E4A] transition cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Optional Details: Best Time, Entry Fee, Your Name */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="block text-[#686C66] mb-1">
                Best Time to Visit:
              </label>
              <input
                type="text"
                value={bestTimeToVisit}
                onChange={(e) => setBestTimeToVisit(e.target.value)}
                placeholder="e.g. Morning 9-11 AM"
                className="w-full px-3 py-2 bg-white border border-[#DDD6CA] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#114B3E]/30"
              />
            </div>

            <div>
              <label className="block text-[#686C66] mb-1">
                Entry Fee:
              </label>
              <input
                type="text"
                value={entryFee}
                onChange={(e) => setEntryFee(e.target.value)}
                placeholder="e.g. Free or 100 DZD"
                className="w-full px-3 py-2 bg-white border border-[#DDD6CA] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#114B3E]/30"
              />
            </div>

            <div>
              <label className="block text-[#686C66] mb-1">
                Your Name / Traveler Alias:
              </label>
              <input
                type="text"
                value={submittedBy}
                onChange={(e) => setSubmittedBy(e.target.value)}
                placeholder="e.g. Karim from Tipaza"
                className="w-full px-3 py-2 bg-white border border-[#DDD6CA] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#114B3E]/30"
              />
            </div>
          </div>

          {/* Notice */}
          <div className="p-3.5 rounded-xl bg-[#FAF4EB] border border-[#E8DFC8] flex items-start gap-2.5 text-xs text-[#54483C]">
            <Info className="w-4 h-4 text-[#C25E37] shrink-0 mt-0.5" />
            <span>
              {isAdmin
                ? 'Logged in as Administrator: This spot will be published immediately upon submission.'
                : 'Your submission will be published once reviewed and verified by an administrator.'}
            </span>
          </div>

          {/* Submit button */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white border border-[#DDD6CA] text-xs font-medium text-[#4A4E4A] hover:bg-[#F3EFE7] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#114B3E] hover:bg-[#0D3B31] text-white text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAdmin ? 'Publish Spot Immediately' : 'Submit Spot for Review'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
