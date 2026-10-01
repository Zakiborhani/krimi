export interface EventPrice {
  label: string
  amount: string
}

export interface EventLocation {
  name: string
  address: string
  // Search string for the map embed and directions link
  mapQuery: string
}

export interface Event {
  slug: string
  date: string
  month: string
  year: string
  artist: string
  subtitle?: string
  city: string
  country: string
  venue: string
  image: string | null
  badge: string
  badgeColor: 'gold' | 'crimson' | 'dark'
  isSoldOut: boolean
  ticketUrl: string
  // Optional details shown on the event's own page
  startsAt?: string // ISO with offset, drives the countdown
  time?: string
  timezone?: string
  organizer?: string
  location?: EventLocation
  lineup?: string[]
  prices?: EventPrice[]
  fromPrice?: string
  priceNote?: string
  ageLimit?: string
  infoPhone?: string
  description?: string[]
  goodToKnow?: string[]
}

export const events: Event[] = [
  {
    slug: 'aryana-rotterdam-2025',
    date: '04',
    month: 'Sep',
    year: '2025',
    artist: 'Aryana',
    subtitle: 'Ladies Only · Unstoppable World Tour',
    city: 'Rotterdam',
    country: 'Netherlands',
    venue: 'Laurenskerk Rotterdam',
    image: '/images/rotterdam.jpeg',
    badge: 'Ladies Only',
    badgeColor: 'gold',
    isSoldOut: false,
    ticketUrl: 'https://www.aryanatour.com',
    lineup: ['Aryana'],
  },
  {
    slug: 'aryana-stockholm-2025',
    date: '05',
    month: 'Sep',
    year: '2025',
    artist: 'Aryana',
    subtitle: 'Ladies Only · Unstoppable World Tour',
    city: 'Stockholm',
    country: 'Sweden',
    venue: 'Fryshuset Arenan',
    image: '/images/stockholm.jpeg',
    badge: 'Ladies Only',
    badgeColor: 'gold',
    isSoldOut: false,
    ticketUrl: 'https://www.aryanatour.com',
    lineup: ['Aryana'],
  },
  {
    slug: 'kabura-cruise-2026',
    date: '11',
    month: 'Dec',
    year: '2026',
    artist: 'Kabura Cruise',
    subtitle: 'Habib Qaderi · Farhad Darya · Aryana · Valy',
    city: 'Stockholm → Tallinn',
    country: '40 Hours, 2 Nights',
    venue: 'The Biggest Afghan Concert Ever',
    image: '/images/stockholm-talinn.jpeg',
    badge: '4 Headliners',
    badgeColor: 'crimson',
    isSoldOut: false,
    ticketUrl: 'https://www.tallink.com/sv/hitta-resa/kryssning/specialkryssningar/kabura-cruise',
    startsAt: '2026-12-11T17:30:00+01:00',
    time: 'Departs 17:30 · 40 hours',
    timezone: 'UTC+1',
    location: {
      name: 'Baltic Queen · Värtaterminalen',
      address: 'Värtahamnen, Stockholm → Tallinn',
      mapQuery: 'Värtaterminalen, Stockholm',
    },
    lineup: ['Farhad Darya', 'Aryana Sayeed', 'Habib Qaderi', 'Valy Hedjasi', '+ 3 DJs'],
    fromPrice: '1 650 kr',
    priceNote: 'per person · E-Standard inside cabin, 4 sharing · fuel & emission surcharge added',
    ageLimit: 'Under 18 welcome with a parent or legal guardian',
    description: [
      'Welcome to the biggest Afghan concert ever — a historic gathering of Afghan music and culture on board the Baltic Queen.',
      'A 40-hour cruise from Stockholm to Tallinn with live concerts by Farhad Darya, Aryana Sayeed, Habib Qaderi and Valy Hedjasi, plus three DJs, along with the ship’s restaurants, shopping and entertainment.',
    ],
    goodToKnow: [
      'Passport required — the cruise visits Tallinn, Estonia',
      'Tickets are booked through Tallink Silja',
      'Bookings must be paid within 14 days, or 28 days before departure, whichever comes first',
    ],
  },
  {
    slug: 'halloween-party-stockholm-2026',
    date: '30',
    month: 'Oct',
    year: '2026',
    artist: 'Halloween Party',
    subtitle: 'Live Performance: DJ Mori · Early Bird 199 kr',
    city: 'Stockholm',
    country: 'Sweden',
    venue: 'Colosseum Nightclub',
    image: '/images/halloween-stockholm.jpeg',
    badge: '18+',
    badgeColor: 'crimson',
    isSoldOut: false,
    ticketUrl: 'https://karimi-entertainment.tickivo.app/233619/halloween-party-stockholm',
    startsAt: '2026-10-30T22:00:00+01:00',
    time: '22:00 – 03:00',
    timezone: 'UTC+1',
    location: {
      name: 'Colosseum Nightclub',
      address: 'Arenavägen 75, 121 77 Johanneshov',
      mapQuery: 'Arenavägen 75, 121 77 Johanneshov',
    },
    lineup: ['DJ Mori'],
    prices: [
      { label: 'Early Bird', amount: '199 kr' },
      { label: 'At the door', amount: '299 kr' },
    ],
    fromPrice: '199 kr',
    ageLimit: '18+',
    infoPhone: '072 91 90 716',
    description: [
      'Karimi Entertainment presents Halloween Party — a dark, high-energy Halloween night at Colosseum Nightclub in Stockholm.',
      'Expect a heavy atmosphere, Halloween vibes, music, partying and a live performance by DJ MORI. Put on your best Halloween outfit and come ready for an unforgettable night.',
    ],
  },
]

// Anything dated before today counts as a previous event.
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const eventDate = (event: Event): Date => {
  const monthIndex = MONTHS.indexOf(event.month)
  return new Date(Number(event.year), monthIndex < 0 ? 0 : monthIndex, Number(event.date))
}

export const eventTime = (event: Event): number => eventDate(event).getTime()

export const startOfToday = (): number => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

export const isPastEvent = (event: Event): boolean => eventTime(event) < startOfToday()

export const DEFAULT_ORGANIZER = 'Karimi Entertainment'

export const findEvent = (slug: string): Event | undefined =>
  events.find((event) => event.slug === slug)
