export interface EventPrice {
  label: string
  amount: string
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
  time?: string
  address?: string
  lineup?: string[]
  prices?: EventPrice[]
  ageLimit?: string
  infoPhone?: string
  description?: string
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
    lineup: ['Habib Qaderi', 'Farhad Darya', 'Aryana', 'Valy'],
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
    time: '22:00 – 03:00',
    address: 'Arenavägen 75, 121 77 Johanneshov',
    lineup: ['DJ Mori'],
    prices: [
      { label: 'Early Bird', amount: '199 kr' },
      { label: 'At the door', amount: '299 kr' },
    ],
    ageLimit: '18+',
    infoPhone: '072 91 90 716',
    description: 'A dark, high-energy Halloween night at Colosseum Nightclub with a live performance by DJ Mori.',
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

export const findEvent = (slug: string): Event | undefined =>
  events.find((event) => event.slug === slug)
