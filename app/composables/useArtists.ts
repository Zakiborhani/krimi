// Artists as edited in the Dara IT portal. Rows without a name are skipped.
import type { Artist } from '~/data/artists'
import { cmsImage, cmsText } from './useCms'

export async function useArtists() {
  const { list } = await useCms()
  const artists: Artist[] = list('artists')
    .map((row, i) => ({
      id: cmsText(row._id) || String(i),
      name: cmsText(row.name),
      origin: cmsText(row.origin),
      genre: cmsText(row.genre),
      bio: cmsText(row.bio),
      image: cmsImage(row.image),
      hasUpcomingEvent: row.upcoming === true,
    }))
    .filter(a => a.name)
  return { artists }
}
