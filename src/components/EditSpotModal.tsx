import React, { useState, useEffect } from 'react';
import { X, Check, Navigation, Sparkles, Upload } from 'lucide-react';
import { Spot } from '../types';
import { ALGERIA_WILAYAS, VIBE_CATEGORIES } from '../data/wilayasAndVibes';
import { sanitizeInput, isValidUrl } from '../utils/security';

interface EditSpotModalProps {
  spot: Spot | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveSpot: (updatedSpot: Spot) => void;
}

export const EditSpotModal: React.FC<EditSpotModalProps> = ({
  spot,
  isOpen,
  onClose,
  onSaveSpot
}) => {
  if (!isOpen || !spot) return null;

  const [title, setTitle] = useState(spot.title);
  const [wilaya, setWilaya] = useState(spot.wilaya);
  const [description, setDescription] = useState(spot.description);
  const [photo, setPhoto] = useState(spot.photo);
  const [googleMapsUrl, setGoogleMapsUrl] = useState(spot.googleMapsUrl);
  const [vibes, setVibes] = useState<string[]>(spot.vibes);
  const [idealFor, setIdealFor] = useState(spot.idealFor);
  const [bestTimeToVisit, setBestTimeToVisit] = useState(spot.bestTimeToVisit || '');
  const [entryFee, setEntryFee] = useState(spot.entryFee || '');
  const [isApproved, setIsApproved] = useState(spot.isApproved);

  useEffect(() => {
    if (spot) {
      setTitle(spot.title);
      setWilaya(spot.wilaya);
      setDescription(spot.description);
      setPhoto(spot.photo);
      setGoogleMapsUrl(spot.googleMapsUrl);
      setVibes(spot.vibes);
      setIdealFor(spot.idealFor);
      setBestTimeToVisit(spot.bestTimeToVisit || '');
      setEntryFee(spot.entryFee || '');
      setIsApproved(spot.isApproved);
    }
  }, [spot]);

  const toggleVibe = (vibeLabel: string) => {
    setVibes((prev) =>
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
          setPhoto(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!spot) return;

    const selectedWilayaObj = ALGERIA_WILAYAS.find((w) => w.name === wilaya);

    let safeMaps = googleMapsUrl.trim();
    if (!safeMaps || !isValidUrl(safeMaps)) {
      safeMaps = `https://maps.google.com/?q=${encodeURIComponent(title.trim() + ' ' + wilaya + ' Algeria')}`;
    }

    let safePhoto = photo.trim();
    if (!isValidUrl(safePhoto)) {
      safePhoto = spot.photo;
    }

    onSaveSpot({
      ...spot,
      title: sanitizeInput(title),
      wilaya,
      wilayaCode: selectedWilayaObj?.code,
      description: sanitizeInput(description),
      photo: safePhoto,
      googleMapsUrl: safeMaps,
      vibes,
      idealFor: sanitizeInput(idealFor),
      bestTimeToVisit: sanitizeInput(bestTimeToVisit) || undefined,
      entryFee: sanitizeInput(entryFee) || undefined,
      isApproved
    });

    onClose();
  };

  return (
    <div
      id="edit-spot-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-[#FAF8F5] rounded-3xl border border-[#E0D9CD] shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E7E1D7] flex items-center justify-between bg-white">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#181B1A]">
              Edit Destination: {spot.title}
            </h2>
            <p className="text-xs text-[#6B6E6A]">
              Modify details, vibes, Google Maps link, and publication status
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#7A7E79] hover:text-[#181B1A] hover:bg-[#EFE9DE] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 overflow-y-auto space-y-6 flex-1 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-7">
              <label className="block font-semibold text-[#383C39] mb-1.5">
                Spot Name / Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#DDD6CA] rounded-xl text-xs sm:text-sm text-[#181B1A] focus:outline-none focus:ring-2 focus:ring-[#114B3E]/30 focus:border-[#114B3E]"
              />
            </div>

            <div className="sm:col-span-5">
              <label className="block font-semibold text-[#383C39] mb-1.5">
                Wilaya (Province)
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

          <div>
            <label className="block font-semibold text-[#383C39] mb-1.5">
              Description
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#DDD6CA] rounded-xl text-xs sm:text-sm text-[#181B1A] focus:outline-none focus:ring-2 focus:ring-[#114B3E]/30 focus:border-[#114B3E]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#383C39] mb-1.5">
              Vibes & Atmosphere
            </label>
            <div className="flex flex-wrap gap-2">
              {VIBE_CATEGORIES.map((vibe) => {
                const active = vibes.includes(vibe.label);
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

          <div>
            <label className="block font-semibold text-[#383C39] mb-1.5">
              Why is this spot ideal for relaxing / travelers? (Vibe Details)
            </label>
            <input
              type="text"
              required
              value={idealFor}
              onChange={(e) => setIdealFor(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#DDD6CA] rounded-xl text-xs sm:text-sm text-[#181B1A] focus:outline-none focus:ring-2 focus:ring-[#114B3E]/30 focus:border-[#114B3E]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#383C39] mb-1.5">
              Google Maps Link
            </label>
            <input
              type="url"
              value={googleMapsUrl}
              onChange={(e) => setGoogleMapsUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#DDD6CA] rounded-xl text-xs sm:text-sm text-[#181B1A] focus:outline-none focus:ring-2 focus:ring-[#114B3E]/30 focus:border-[#114B3E]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#383C39] mb-1.5">
              Photo URL
            </label>
            <input
              type="url"
              value={photo.startsWith('data:') ? '[Uploaded Image File]' : photo}
              disabled={photo.startsWith('data:')}
              onChange={(e) => setPhoto(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#DDD6CA] rounded-xl text-xs sm:text-sm text-[#181B1A] focus:outline-none focus:ring-2 focus:ring-[#114B3E]/30 focus:border-[#114B3E]"
            />
            <div className="mt-2 flex items-center gap-3">
              <label
                htmlFor="edit-upload-input"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-[#F3EFE7] border border-dashed border-[#C5BCAD] rounded-xl text-xs font-medium text-[#4A4E4A] transition cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-[#114B3E]" />
                <span>Replace with file from device</span>
              </label>
              <input
                id="edit-upload-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[#686C66] mb-1">
                Best Time to Visit:
              </label>
              <input
                type="text"
                value={bestTimeToVisit}
                onChange={(e) => setBestTimeToVisit(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#DDD6CA] rounded-xl text-xs"
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
                className="w-full px-3 py-2 bg-white border border-[#DDD6CA] rounded-xl text-xs"
              />
            </div>
          </div>

          {/* Publication Status Toggle */}
          <div className="p-4 rounded-xl bg-white border border-[#E7E1D7] flex items-center justify-between">
            <div>
              <span className="font-semibold text-[#181B1A] block">Publication Status</span>
              <span className="text-[11px] text-[#7A7E79]">
                {isApproved
                  ? 'Published: Visible to all travelers on the website'
                  : 'Pending: Hidden until approved by admin'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsApproved(!isApproved)}
              className={`px-3.5 py-1.5 rounded-xl font-semibold text-xs transition cursor-pointer ${
                isApproved
                  ? 'bg-[#114B3E] text-white'
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}
            >
              {isApproved ? 'Approved' : 'Mark as Pending'}
            </button>
          </div>

          {/* Action buttons */}
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
              <Check className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
