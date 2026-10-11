// Events as edited in the Dara IT portal, converted back to the Event shape
// the pages use. Rows without a valid date or slug are skipped.
import type { Event, EventPrice } from '~/data/events'
import type { CmsRow } from '~/cms/manifest'
import { cmsImage, cmsLines, cmsParagraphs, cmsText } from './useCms'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const BADGE_COLORS: Event['badgeColor'][] = ['gold', 'crimson', 'dark']

/** Stockholm's UTC offset in minutes on a given date (handles summer time). */
function stockholmOffset(y: number, m: number, d: number, hh: number, mm: number): number {
  const utc = Date.UTC(y, m - 1, d, hh, mm)
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Stockholm', hourCycle: 'h23',
    year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric',
  }).formatToParts(new Date(utc))
  const n = (t: string) => Number(parts.find(p => p.type === t)?.value)
  return (Date.UTC(n('year'), n('month') - 1, n('day'), n('hour'), n('minute')) - utc) / 60000
}

function toEvent(row: CmsRow): Event | null {
  const slug = cmsText(row.slug).toLowerCase()
  const start = cmsText(row.start).match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T](\d{1,2}):(\d{2}))?/)
  if (!slug || !start) return null
  const [y, m, d] = [Number(start[1]), Number(start[2]), Number(start[3])]
  if (m < 1 || m > 12) return null

  let startsAt: string | undefined
  let timezone: string | undefined
  if (start[4]) {
    const [hh, mm] = [Number(start[4]), Number(start[5])]
    const offset = stockholmOffset(y, m, d, hh, mm)
    const sign = offset < 0 ? '-' : '+'
    const abs = Math.abs(offset)
    const pad = (x: number) => String(x).padStart(2, '0')
    startsAt = `${y}-${pad(m)}-${pad(d)}T${pad(hh)}:${pad(mm)}:00${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`
    timezone = `UTC${sign}${abs / 60}`
  }

  const [locName, locAddress, locMap] = cmsLines(row.location)
  const prices: EventPrice[] = cmsLines(row.prices).map((line) => {
    const i = line.lastIndexOf(':')
    return i > 0 ? { label: line.slice(0, i).trim(), amount: line.slice(i + 1).trim() } : { label: line, amount: '' }
  })
  const lineup = cmsText(row.lineup).split(',').map(s => s.trim()).filter(Boolean)
  const description = cmsParagraphs(row.description)
  const goodToKnow = cmsLines(row.goodToKnow)
  const badgeColor = cmsText(row.badgeColor).toLowerCase() as Event['badgeColor']
  const opt = (v: string) => v || undefined

  return {
    slug,
    date: String(d).padStart(2, '0'),
    month: MONTHS[m - 1]!,
    year: String(y),
    artist: cmsText(row.artist),
    subtitle: opt(cmsText(row.subtitle)),
    city: cmsText(row.city),
    country: '',
    venue: cmsText(row.venue),
    image: cmsImage(row.image) || null,
    badge: cmsText(row.badge),
    badgeColor: BADGE_COLORS.includes(badgeColor) ? badgeColor : 'dark',
    isSoldOut: row.soldOut === true,
    ticketUrl: cmsText(row.ticketUrl),
    startsAt,
    time: opt(cmsText(row.time)),
    timezone,
    location: locName
      ? { name: locName, address: locAddress ?? '', mapQuery: locMap || locAddress || locName }
      : undefined,
    lineup: lineup.length ? lineup : undefined,
    prices: prices.length ? prices : undefined,
    fromPrice: opt(cmsText(row.fromPrice)),
    priceNote: opt(cmsText(row.priceNote)),
    infoPhone: opt(cmsText(row.infoPhone)),
    description: description.length ? description : undefined,
    goodToKnow: goodToKnow.length ? goodToKnow : undefined,
  }
}

export async function useEvents() {
  const { list } = await useCms()
  const events = list('events').map(toEvent).filter((e): e is Event => e !== null)
  const findEvent = (slug: string) => events.find(e => e.slug === slug.toLowerCase())
  return { events, findEvent }
}
