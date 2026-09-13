# Discover Algeria - Tourist Spots & Hidden Gems

[![React](https://img.shields.io/badge/React-19-61dafb.svg?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8.svg?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-000000.svg?style=flat-square&logo=express)](https://expressjs.com/)
[![License](https://img.shields.io/badge/license-MIT-emerald.svg?style=flat-square)](LICENSE)
[![GitHub](https://img.shields.io/badge/Developer-amsaqeeus-181717.svg?style=flat-square&logo=github)](https://github.com/amsaqeeus)

A modern full-stack web application designed to explore, curate, and review tourist destinations, natural wonders, and hidden gems across all 58 Wilayas of Algeria. Built with high aesthetic precision, responsive editorial design, and an enterprise-grade hardened security backend.

Developed by **[@amsaqeeus](https://github.com/amsaqeeus)**.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
  - [Spot Directory & Exploration](#spot-directory--exploration)
  - [Filtering & Discovery](#filtering--discovery)
  - [Spot Details & Interactive Reviews](#spot-details--interactive-reviews)
  - [Community Submissions](#community-submissions)
  - [Admin Moderation & Management](#admin-moderation--management)
- [Security Architecture](#security-architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Development Mode](#development-mode)
  - [Production Build](#production-build)
- [API Reference](#api-reference)
- [Author](#author)
- [License](#license)

---

## Overview

Algeria boasts extraordinary geographical and historical diversity—from Mediterranean coastlines and ancient Roman ruins to verdant mountain gorges and the majestic Sahara desert. **Discover Algeria** provides travelers with a centralized, curated platform to find verified destinations and hidden spots, submit local recommendations, read honest traveler reviews, and get real-time navigation directions via Google Maps.

---

## Key Features

### Spot Directory & Exploration
- Curated collection of Algerian highlights: Tassili n'Ajjer, Kasbah of Algiers, Jardin d'Essai du Hamma, Santa Cruz Fortress in Oran, Ghoufi Balconies, Taghit Oasis, Cap Carbon in Béjaïa, and more.
- High-resolution imagery, historical background, best visiting seasons, and entry fee advisories.
- Direct navigation links to Google Maps coordinates.

### Filtering & Discovery
- **58 Wilayas Search**: Filter instantly across all Algerian administrative provinces (Algiers, Oran, Constantine, Béjaïa, Tamanrasset, Biskra, etc.).
- **Vibe Categories**:
  - *Ideal for Relaxing*
  - *Peaceful Park & Gardens*
  - *Historical & Heritage*
  - *Golden Sunset & Panoramas*
  - *Coastal & Sea Breeze*
  - *Sahara & Desert Oasis*
  - *Adventure & Hiking*
  - *Family & Group Friendly*
  - *Café & Cultural Vibe*
- **Sorting Options**: Highest Rated, Most Reviewed, and Recently Added.

### Spot Details & Interactive Reviews
- Comprehensive detail modal featuring spot highlights, ideal traveler type, seasonal recommendations, and average ratings.
- Community review system allowing travelers to submit star ratings, detailed feedback, and contextual vibe notes.

### Community Submissions
- Intuitive modal for locals and travelers to contribute newly discovered spots.
- Photo URL input with live preview, Wilaya selector, vibe tags, entry fees, and Google Maps links.
- New submissions enter a moderation queue awaiting administrative approval.

### Admin Moderation & Management
- Secure administrative portal for content curators.
- Direct approval and rejection workflows for pending submissions.
- Full editing capabilities (title, description, wilaya, coordinates, vibes, imagery) and deletion controls.
- Review moderation tools to maintain community guidelines.
- Custom brand emblem and logo controls.

---

## Security Architecture

The application enforces a hardened server-side security layer implemented in `server.ts`:

- **Timing-Safe Authentication**: Admin password comparison uses SHA-256 digests and `crypto.timingSafeEqual()` to eliminate side-channel timing attacks.
- **Brute-Force Rate Limiting**: Client IP tracking automatically triggers a 15-minute lockout after 5 consecutive failed attempts.
- **Cryptographically Secure Session Tokens**: 256-bit entropy tokens (`crypto.randomBytes(32)`) with a 12-hour expiration window.
- **Zero Plaintext Credential Exposure**: Passwords and secrets are never transmitted to or stored in client-side bundles.
- **Hardened HTTP Headers**: Equipped with `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `X-XSS-Protection`, and `Referrer-Policy: strict-origin-when-cross-origin`.
- **Health & Security Status Endpoint**: Live monitoring endpoint at `/api/security/status`.

---

## Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 19 | UI component architecture and state management |
| **Language** | TypeScript 5.8 | End-to-end static type safety |
| **Styling** | Tailwind CSS v4 | Utility-first, responsive editorial design |
| **Icons** | Lucide React | Clean, scalable SVG icons |
| **Animations** | Motion | Smooth layout transitions and modal interactions |
| **Backend** | Node.js + Express 4.21 | Server runtime, security endpoints & Vite middleware |
| **Bundler** | Vite 6 + esbuild | Fast development HMR and production bundle compilation |

---

## Project Structure

```text
├── .env.example              # Template for environment configuration
├── index.html                # HTML entry point with metadata tags
├── metadata.json             # Application metadata and capabilities
├── package.json              # Project dependencies and operational scripts
├── server.ts                 # Express backend with security & auth endpoints
├── tsconfig.json             # TypeScript compiler configuration
├── vite.config.ts            # Vite build configuration with Tailwind plugin
└── src/
    ├── App.tsx               # Main application orchestration & state
    ├── main.tsx              # React DOM entry point
    ├── index.css             # Tailwind CSS imports & global styles
    ├── types.ts              # Core TypeScript interfaces (Spot, Review, Vibe)
    ├── components/
    │   ├── AddSpotModal.tsx      # Submission form for new spots
    │   ├── AdminModal.tsx        # Administration and moderation dashboard
    │   ├── BrandLogo.tsx         # Responsive Algerian brand mark & emblem
    │   ├── EditSpotModal.tsx     # Spot editor modal for administrators
    │   ├── FilterBar.tsx         # Search, wilaya, vibe pills & sort controls
    │   ├── Header.tsx            # Navigation bar with action triggers
    │   ├── SpotCard.tsx          # Card display for tourist spots
    │   └── SpotDetailModal.tsx   # Detailed modal with reviews and gallery
    ├── data/
    │   ├── initialSpots.ts       # Seed data for curated spots across Algeria
    │   └── wilayasAndVibes.ts    # 58 Wilayas list & vibe classifications
    └── utils/
        ├── security.ts           # Client-side API authentication helpers
        └── storage.ts            # Local persistence & session management
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/amsaqeeus/discover-algeria.git
   cd discover-algeria
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Variables

Copy the example environment file and configure your credentials:

```bash
cp .env.example .env
```

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `ADMIN_PASSWORD` | Administrator password for approving and moderating spots | `visit 2026` |
| `PORT` | Local server port (optional) | `3000` |
| `GEMINI_API_KEY` | Optional API key for Google Gemini generative AI features | (Optional) |

### Development Mode

Start the integrated development server with hot module reloading:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:3000`.

### Production Build

To compile the frontend and bundle the backend for production:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

---

## API Reference

### Security & Authentication

#### `POST /api/auth/login`
Authenticates the administrator with rate limiting and timing-safe comparison.
- **Request Body**:
  ```json
  {
    "password": "your-admin-password"
  }
  ```
- **Responses**:
  - `200 OK`: Returns session token with TTL.
  - `401 Unauthorized`: Returns remaining failed attempts.
  - `429 Too Many Requests`: Account locked out after 5 consecutive failures.

#### `GET /api/auth/verify`
Validates an active session token.
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ "valid": true, "expiresAt": 1726000000000 }`

#### `POST /api/auth/logout`
Terminates and invalidates an active session token.
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ "success": true, "message": "Logged out successfully" }`

#### `GET /api/security/status`
Returns real-time health metrics of the security engine (rate limits, active sessions, lockout policies).

---

## Author

Crafted by **[@amsaqeeus](https://github.com/amsaqeeus)**.

Feel free to connect, open issues, or submit pull requests to celebrate and showcase the beauty of Algeria!

---

## License

This project is licensed under the [MIT License](LICENSE).
