// What the customer can edit in the Dara IT portal (CMS format v2).
// Published at /.well-known/dara-cms.json (server/routes); the portal fetches
// it from the customer's website address and builds the edit form from it.
// Defaults are today's content, so the site looks the same until the customer
// saves something.
//
// Keys are stable — never rename a key, or saved content stops showing.
// Spec: friendly-crm-enhancer/docs/cms-v2.md
import { artists } from '../data/artists'
import { events, type Event } from '../data/events'

/** Live origin. Default images are sent as absolute URLs because the portal
 *  only accepts https or its own image address; useCms() strips it again. */
export const SITE_ORIGIN = 'https://www.karimientertainment.com'

export type CmsValue = string | number | boolean | null
export type CmsRow = { _id?: string } & Record<string, CmsValue>

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** "2026-10-30 22:00" (time only when the event has a start time). */
function toStart(event: Event): string {
  const month = String(MONTHS.indexOf(event.month) + 1).padStart(2, '0')
  const day = `${event.year}-${month}-${event.date.padStart(2, '0')}`
  const time = event.startsAt?.match(/T(\d{2}:\d{2})/)?.[1]
  return time ? `${day} ${time}` : day
}

function toRow(event: Event): CmsRow {
  const goodToKnow = [
    ...(event.ageLimit ? [`Age limit: ${event.ageLimit}`] : []),
    ...(event.goodToKnow ?? []),
  ]
  const location = event.location
    ? [event.location.name, event.location.address, event.location.mapQuery !== event.location.address ? event.location.mapQuery : '']
        .filter(Boolean).join('\n')
    : ''
  return {
    slug: event.slug,
    start: toStart(event),
    artist: event.artist,
    subtitle: event.subtitle ?? '',
    city: event.city,
    venue: event.venue,
    image: event.image ? SITE_ORIGIN + event.image : '',
    badge: event.badge,
    'badge-color': event.badgeColor,
    'sold-out': event.isSoldOut,
    'ticket-url': event.ticketUrl,
    time: event.time ?? '',
    location,
    lineup: (event.lineup ?? []).join(', '),
    prices: (event.prices ?? []).map(p => `${p.label}: ${p.amount}`).join('\n'),
    'from-price': event.fromPrice ?? '',
    'price-note': event.priceNote ?? '',
    'info-phone': event.infoPhone ?? '',
    description: (event.description ?? []).join('\n\n'),
    'good-to-know': goodToKnow.join('\n'),
  }
}

// Pages in the portal form, in the order the customer sees them.
const EVENTS = 'Event'
const ARTISTS = 'Artister'
const PARTNERS = 'Partners'
const CONTACT = 'Kontakt'
const GENERAL = 'Allmänt'

export const cmsManifest = {
  version: 2,
  fields: [
    { key: 'contact.phone', type: 'text', label: 'Telefon', page: CONTACT, default: '+46 72 919 07 16' },
    { key: 'contact.email', type: 'text', label: 'E-post', page: CONTACT, default: 'info@karimientertainment.com' },
    { key: 'social.instagram', type: 'url', label: 'Instagram-länk', page: CONTACT, default: 'https://www.instagram.com/karimi_entertainment/' },
    { key: 'social.tiktok', type: 'url', label: 'TikTok-länk', page: CONTACT, default: 'https://www.tiktok.com/@karimi_entertainment' },
    { key: 'social.youtube', type: 'url', label: 'YouTube-länk', page: CONTACT, default: 'https://www.youtube.com/@karimi_entertainment' },
    { key: 'social.facebook', type: 'url', label: 'Facebook-länk', page: CONTACT, default: 'https://www.facebook.com/karimientertainment/' },
    { key: 'footer.text', type: 'text', label: 'Text i sidfoten', page: GENERAL, default: 'Bringing the finest Afghan & Iranian artists to stages across Europe.' },
  ],
  lists: [
    {
      key: 'events',
      label: 'Event',
      page: EVENTS,
      itemFields: [
        { key: 'artist', type: 'text', label: 'Rubrik / artist', required: true },
        { key: 'slug', type: 'text', label: 'Adress (t.ex. aryana-stockholm-2026 – ändra inte efter publicering)', required: true },
        { key: 'start', type: 'text', label: 'Datum och starttid (2026-10-30 22:00, tiden kan utelämnas)', required: true },
        { key: 'city', type: 'text', label: 'Stad' },
        { key: 'venue', type: 'text', label: 'Lokal' },
        { key: 'subtitle', type: 'text', label: 'Underrubrik' },
        { key: 'image', type: 'image', label: 'Affisch' },
        { key: 'badge', type: 'text', label: 'Etikett (t.ex. 18+)' },
        { key: 'badge-color', type: 'text', label: 'Etikettfärg: gold, crimson eller dark' },
        { key: 'sold-out', type: 'boolean', label: 'Slutsålt' },
        { key: 'ticket-url', type: 'url', label: 'Biljettlänk' },
        { key: 'time', type: 'text', label: 'Tid som visas (t.ex. 22:00 – 03:00)' },
        { key: 'location', type: 'richtext', label: 'Plats: namn, adress och ev. kartsökning – en per rad' },
        { key: 'lineup', type: 'text', label: 'Lineup (komma mellan namnen)' },
        { key: 'prices', type: 'richtext', label: 'Priser, en per rad (Early Bird: 199 kr)' },
        { key: 'from-price', type: 'text', label: 'Från-pris (t.ex. 199 kr)' },
        { key: 'price-note', type: 'text', label: 'Pristext' },
        { key: 'info-phone', type: 'text', label: 'Telefon för info' },
        { key: 'description', type: 'richtext', label: 'Beskrivning (tom rad mellan stycken)' },
        { key: 'good-to-know', type: 'richtext', label: 'Bra att veta, en per rad' },
      ],
      default: events.map(toRow),
    },
    {
      key: 'artists',
      label: 'Artister',
      page: ARTISTS,
      itemFields: [
        { key: 'name', type: 'text', label: 'Namn', required: true },
        { key: 'origin', type: 'text', label: 'Ursprung (t.ex. Afghanistan)' },
        { key: 'genre', type: 'text', label: 'Genre (t.ex. Folk · Traditional)' },
        { key: 'bio', type: 'richtext', label: 'Kort beskrivning' },
        { key: 'image', type: 'image', label: 'Bild (stående)' },
        { key: 'upcoming', type: 'boolean', label: 'Visa märket "Upcoming"' },
      ],
      default: artists.map(a => ({
        name: a.name,
        origin: a.origin,
        genre: a.genre,
        bio: a.bio,
        image: SITE_ORIGIN + a.image,
        upcoming: a.hasUpcomingEvent,
      })),
    },
    {
      key: 'partners',
      label: 'Partners',
      page: PARTNERS,
      itemFields: [
        { key: 'name', type: 'text', label: 'Namn', required: true },
        { key: 'logo', type: 'image', label: 'Logotyp (valfri – utan logotyp visas namnet)' },
        { key: 'url', type: 'url', label: 'Länk (valfri)' },
      ],
      default: ['Dara-it.com', 'AFAS Live', 'Elbphilharmonie', 'Olympia Paris', 'Royal Albert Hall', 'Ticketmaster', 'Eventim', 'Live Nation']
        .map(name => ({ name, logo: '', url: '' })),
    },
  ],
} as const

export type CmsFieldKey = (typeof cmsManifest.fields)[number]['key']
export type CmsListKey = (typeof cmsManifest.lists)[number]['key']
