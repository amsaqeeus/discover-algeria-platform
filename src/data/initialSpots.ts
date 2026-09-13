import { Spot } from '../types';

export const INITIAL_SPOTS: Spot[] = [
  {
    id: 'spot-hamma-garden',
    title: "Jardin d'Essai du Hamma",
    wilaya: 'Algiers (Alger)',
    wilayaCode: '16',
    description: "A legendary botanical haven founded in 1832, featuring over 1,200 plant species, towering dragon trees, serene French & British garden lanes, and gentle fountains. One of the most tranquil escapes in the heart of the capital.",
    photo: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
    googleMapsUrl: "https://maps.google.com/?q=Jardin+d'Essai+du+Hamma+Algiers",
    vibes: ['Ideal for Relaxing', 'Peaceful Park & Gardens', 'Family & Group Friendly'],
    idealFor: 'Peaceful reading under century-old banyan trees, morning walks, soothing nature photography, and family relaxation away from city noise.',
    bestTimeToVisit: 'Morning between 9:00 AM - 12:00 PM or weekdays for maximum peace and quiet',
    entryFee: '150 DZD (approx. $1)',
    submittedBy: 'Amine Benali (Algiers local)',
    createdAt: '2026-04-10',
    isApproved: true,
    reviews: [
      {
        id: 'rev-1',
        authorName: 'Yasmine K.',
        rating: 5,
        comment: 'Truly a peaceful paradise in Algiers. The bamboo alley is so calm and cool even on warm summer days. Perfect for relaxing with a book.',
        createdAt: '2026-05-18',
        vibeFeedback: '100% serene and relaxing'
      },
      {
        id: 'rev-2',
        authorName: 'Karim Mansouri',
        rating: 5,
        comment: 'Clean, well maintained, and lots of shaded benches. A must-visit spot when visiting Algiers.',
        createdAt: '2026-06-02'
      }
    ]
  },
  {
    id: 'spot-tipaza-ruins',
    title: 'Tipaza Roman Ruins by the Sea',
    wilaya: 'Tipaza',
    wilayaCode: '42',
    description: 'An enchanting UNESCO World Heritage site where ancient Roman amphitheaters, basilicas, and stone pathways meet the turquoise waters of the Mediterranean, shaded by fragrant pine trees.',
    photo: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
    googleMapsUrl: 'https://maps.google.com/?q=Tipasa+Ruins+Algeria',
    vibes: ['Ideal for Relaxing', 'Historical & Heritage', 'Coastal & Sea Breeze'],
    idealFor: 'Meditative sea-cliff walks, gentle waves sound, historical contemplation, and Albert Camus memorial visit.',
    bestTimeToVisit: 'Late afternoon in spring or autumn to catch the golden sun reflecting on the sea',
    entryFee: '100 DZD',
    submittedBy: 'Nadia Cherif',
    createdAt: '2026-04-12',
    isApproved: true,
    reviews: [
      {
        id: 'rev-3',
        authorName: 'Sofiane D.',
        rating: 5,
        comment: 'As Albert Camus wrote: "In Tipasa in spring, the gods speak through the sun and the scent of absinthe." Incredible vibe where history meets sea waves.',
        createdAt: '2026-06-15',
        vibeFeedback: 'Extremely peaceful with the sea breeze'
      }
    ]
  },
  {
    id: 'spot-santa-cruz',
    title: 'Fort & Chapelle Santa Cruz',
    wilaya: 'Oran',
    wilayaCode: '31',
    description: 'Perched atop Mount Murdjadjo at over 400 meters above sea level, Fort Santa Cruz offers an awe-inspiring panoramic view of Oran city, the Mediterranean bay, and the historic Mers El Kébir harbor.',
    photo: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    googleMapsUrl: 'https://maps.google.com/?q=Fort+Santa+Cruz+Oran+Algeria',
    vibes: ['Golden Sunset & Panoramas', 'Historical & Heritage', 'Coastal & Sea Breeze'],
    idealFor: 'Catching the most breathtaking golden sunset in western Algeria and enjoying cool mountain breezes with scenic vistas.',
    bestTimeToVisit: 'One hour before sunset to see the city lights begin to sparkle',
    entryFee: 'Free entry (Cable car ticket available from town)',
    submittedBy: 'Rayane Wahran',
    createdAt: '2026-04-20',
    isApproved: true,
    reviews: [
      {
        id: 'rev-4',
        authorName: 'Lina Hadj',
        rating: 5,
        comment: 'Take the cable car up from Oran! The breeze and view are unforgettable. Super calm atmosphere up top.',
        createdAt: '2026-07-01'
      }
    ]
  },
  {
    id: 'spot-taghit-dunes',
    title: 'Taghit Dunes & Grand Erg Occidental',
    wilaya: 'Béchar',
    wilayaCode: '08',
    description: 'Known as the "Enchanting Oasis", Taghit features majestic reddish-gold dunes towering over a lush green palm grove and an ancient 11th-century earthen ksar. Peaceful silence and magical starry nights.',
    photo: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    googleMapsUrl: 'https://maps.google.com/?q=Taghit+Béchar+Algeria',
    vibes: ['Sahara & Desert Oasis', 'Ideal for Relaxing', 'Golden Sunset & Panoramas'],
    idealFor: 'Total mental reset, meditating on sand dunes, watching starlit constellations, and enjoying mint tea under date palms.',
    bestTimeToVisit: 'October to April when desert temperatures are mild and welcoming',
    entryFee: 'Free open access',
    submittedBy: 'Bilal Saada',
    createdAt: '2026-05-01',
    isApproved: true,
    reviews: [
      {
        id: 'rev-5',
        authorName: 'Meriem B.',
        rating: 5,
        comment: 'The silence of the dunes at sunrise made all my stress disappear. An absolute jewel of Algeria.',
        createdAt: '2026-07-14',
        vibeFeedback: 'Pure spiritual calm'
      }
    ]
  },
  {
    id: 'spot-pont-sidi-mcid',
    title: "Sidi M'Cid Suspension Bridge & Rhummel Gorge",
    wilaya: 'Constantine',
    wilayaCode: '25',
    description: 'Suspended 175 meters above the dizzying Rhummel River canyon, this historic bridge built in 1912 connects the casbah rock to the opposite cliff, offering dramatic natural and architectural vistas.',
    photo: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80',
    googleMapsUrl: "https://maps.google.com/?q=Pont+Sidi+M'Cid+Constantine",
    vibes: ['Golden Sunset & Panoramas', 'Historical & Heritage', 'Adventure & Hiking'],
    idealFor: 'Experiencing the grandeur of the "City of Bridges", walking along the dramatic cliff promenade, and birdwatching falcons.',
    bestTimeToVisit: 'Early evening as the warm amber canyon lights illuminate the stone arches',
    entryFee: 'Free public access',
    submittedBy: 'Farid Constantine',
    createdAt: '2026-05-04',
    isApproved: true,
    reviews: [
      {
        id: 'rev-6',
        authorName: 'Hichem T.',
        rating: 4,
        comment: 'Thrilling height and gorgeous canyon views. Walking across while hearing the river far below is a unique experience.',
        createdAt: '2026-07-22'
      }
    ]
  },
  {
    id: 'spot-cap-carbon',
    title: 'Cap Carbon & Gouraya Cliff Trails',
    wilaya: 'Béjaïa',
    wilayaCode: '06',
    description: 'One of the tallest maritime lighthouses in the world, surrounded by limestone sea cliffs, azure coves, pine forests, and playful Barbary macaques inside the Gouraya Biosphere Reserve.',
    photo: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    googleMapsUrl: 'https://maps.google.com/?q=Cap+Carbon+Béjaïa+Algeria',
    vibes: ['Coastal & Sea Breeze', 'Peaceful Park & Gardens', 'Adventure & Hiking'],
    idealFor: 'Scenic coastal hiking, breathing fresh maritime pine air, watching dolphin pods offshore, and picnic relaxation.',
    bestTimeToVisit: 'Morning 8:00 AM - 11:00 AM before midday warmth',
    entryFee: 'Free (National park entry points free)',
    submittedBy: 'Samia Bougie',
    createdAt: '2026-05-15',
    isApproved: true,
    reviews: [
      {
        id: 'rev-7',
        authorName: 'Tarek L.',
        rating: 5,
        comment: 'The contrast between the emerald green cliffs and deep blue sea is breathtaking. Very soothing sound of waves.',
        createdAt: '2026-08-05',
        vibeFeedback: 'Fresh refreshing sea breeze'
      }
    ]
  },
  {
    id: 'spot-ghoufi-canyons',
    title: 'Balcons du Ghoufi (Ghoufi Canyons)',
    wilaya: 'Batna',
    wilayaCode: '05',
    description: 'Often celebrated as the "Grand Canyon of the Aurès", this magnificent canyon sculpted by the Abiod river features tiered palm groves on the canyon floor and ancient troglodyte adobe villages built into the golden cliff walls.',
    photo: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
    googleMapsUrl: 'https://maps.google.com/?q=Balcons+du+Ghoufi+Batna',
    vibes: ['Golden Sunset & Panoramas', 'Historical & Heritage', 'Adventure & Hiking'],
    idealFor: 'Taking in awe-inspiring geological beauty, savoring local dates, and relaxing at cliffside balcony viewpoints.',
    bestTimeToVisit: 'Spring or late afternoon for warm golden cliff reflections',
    entryFee: 'Free panoramic viewpoints',
    submittedBy: 'Chaouia Traveler',
    createdAt: '2026-05-20',
    isApproved: true,
    reviews: [
      {
        id: 'rev-8',
        authorName: 'Anis R.',
        rating: 5,
        comment: 'Standing on the balconies looking down at the oasis below is magical. Very calming and awe-inspiring.',
        createdAt: '2026-08-11'
      }
    ]
  }
];
