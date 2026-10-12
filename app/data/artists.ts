// Today's artists — the defaults for the editable artist list in the
// Dara IT portal (cms/manifest.ts). The site reads them through useArtists().
export interface Artist {
  id: string
  name: string
  origin: string
  genre: string
  bio: string
  image: string
  hasUpcomingEvent: boolean
}

export const artists: Artist[] = [
  {
    id: '1',
    name: 'Habib Qaderi',
    origin: 'Afghanistan',
    genre: 'Folk · Traditional',
    bio: 'A voice rooted in Afghan tradition, blending timeless folk melodies with heartfelt storytelling.',
    image: '/images/artists/habib-qaderi.jpg',
    hasUpcomingEvent: true,
  },
  {
    id: '2',
    name: 'Farhad Darya',
    origin: 'Afghanistan',
    genre: 'Folk · Classical',
    bio: "One of Afghanistan's most celebrated artists, renowned for classical arrangements and powerful live performances.",
    image: '/images/artists/farahad-darya.jpeg',
    hasUpcomingEvent: true,
  },
  {
    id: '3',
    name: 'Aryana',
    origin: 'Afghanistan',
    genre: 'Pop · Folk',
    bio: 'A rising force blending contemporary pop with Afghan folk roots, captivating audiences across Europe.',
    image: '/images/artists/aryana.jpeg',
    hasUpcomingEvent: true,
  },
  {
    id: '4',
    name: 'Valy',
    origin: 'Afghanistan',
    genre: 'Pop · Contemporary',
    bio: 'A bold, contemporary sound reshaping modern Afghan pop for a new generation of listeners.',
    image: '/images/artists/valy.jpeg',
    hasUpcomingEvent: true,
  },
]
