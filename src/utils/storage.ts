import { Spot, Review } from '../types';
import { INITIAL_SPOTS } from '../data/initialSpots';

const STORAGE_KEY = 'algeria_tourist_spots_v1';
const ADMIN_TOKEN_KEY = 'algeria_admin_token_v2';
const CUSTOM_LOGO_KEY = 'algeria_custom_logo_v1';

export function loadCustomLogo(): string | null {
  try {
    return localStorage.getItem(CUSTOM_LOGO_KEY);
  } catch {
    return null;
  }
}

export function saveCustomLogo(logoUrl: string | null): void {
  try {
    if (logoUrl) {
      localStorage.setItem(CUSTOM_LOGO_KEY, logoUrl);
    } else {
      localStorage.removeItem(CUSTOM_LOGO_KEY);
    }
  } catch (err) {
    console.error('Error saving custom logo:', err);
  }
}

export function loadSpots(): Spot[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      saveSpots(INITIAL_SPOTS);
      return INITIAL_SPOTS;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SPOTS;
  } catch (err) {
    console.error('Error loading spots from localStorage:', err);
    return INITIAL_SPOTS;
  }
}

export function saveSpots(spots: Spot[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(spots));
  } catch (err) {
    console.error('Error saving spots to localStorage:', err);
  }
}

export function getAdminToken(): string | null {
  try {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAdminToken(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem(ADMIN_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
    }
  } catch (err) {
    console.error('Error updating admin token:', err);
  }
}

export function calculateAverageRating(reviews: Review[]): { average: number; count: number } {
  if (!reviews || reviews.length === 0) {
    return { average: 5.0, count: 0 };
  }
  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  const average = Number((total / reviews.length).toFixed(1));
  return { average, count: reviews.length };
}
