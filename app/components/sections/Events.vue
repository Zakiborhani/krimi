<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface Event {
  id: string
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
}

const events: Event[] = [
  {
    id: '1',
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
  },
  {
    id: '2',
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
  },
  {
    id: '3',
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
  },
]

const sectionRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const cardRefs = ref<HTMLElement[]>([])

const setCardRef = (el: HTMLElement | null, index: number) => {
  if (el) cardRefs.value[index] = el
}

const badgeClasses: Record<Event['badgeColor'], string> = {
  gold: 'text-bg-dark bg-gold',
  crimson: 'text-white bg-crimson',
  dark: 'text-ink-light bg-bg-dark',
}

onMounted(async () => {
  if (import.meta.client) {
    const { gsap } = await import('gsap')
    const { ScrollTrigger } = await import('gsap/ScrollTrigger')
    gsap.registerPlugin(ScrollTrigger)

    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        headerRef.value,
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.value, start: 'top 80%' },
        }
      )
      gsap.fromTo(
        cardRefs.value,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12,
          scrollTrigger: { trigger: sectionRef.value, start: 'top 70%' },
        }
      )
    })
  }
})
</script>

<template>
  <section
    id="events"
    ref="sectionRef"
    class="relative bg-bg py-section px-6 md:px-10 lg:px-16"
  >
    <div class="max-w-site mx-auto">

      <!-- Section Header -->
      <div ref="headerRef" class="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12 md:mb-16">
        <div>
          <span class="block text-[10px] tracking-[0.35em] uppercase font-sans text-crimson mb-4">
            2026 Season
          </span>
          <h2 class="font-display text-display-sm text-ink font-light leading-none">
            Events worth<br />
            <span class="italic">crossing borders</span> for.
          </h2>
        </div>
        <a
          href="/#events"
          class="inline-flex items-center gap-3 shrink-0 text-[10px] tracking-[0.2em] uppercase font-sans text-ink border border-ink/40 rounded-full px-6 py-3 hover:bg-ink hover:text-bg transition-all duration-300"
        >
          <span>View All Events</span>
          <span>→</span>
        </a>
      </div>

      <!-- Cards Grid — left to right -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div
          v-for="(event, index) in events"
          :key="event.id"
          :ref="(el) => setCardRef(el as HTMLElement, index)"
          class="group relative flex flex-col bg-surface rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,36,41,0.12)] hover:shadow-[0_12px_40px_rgba(0,36,41,0.18)] transition-shadow duration-500"
        >

          <!-- Image -->
          <div class="relative w-full overflow-hidden bg-elevated">

            <!-- Real image -->
            <img
              v-if="event.image"
              :src="event.image"
              :alt="event.artist"
              class="w-full h-auto transition-transform duration-[1200ms] ease-power2-out group-hover:scale-105"
            />

            <!-- Placeholder for missing images -->
            <div
              v-else
              class="w-full aspect-[4/3] flex items-center justify-center"
            >
              <span class="font-display text-4xl font-light text-ink/10 tracking-widest uppercase">
                {{ event.artist.charAt(0) }}
              </span>
            </div>

            <!-- Badge -->
            <div
              v-if="event.isSoldOut"
              class="absolute top-4 left-4 text-[9px] tracking-[0.25em] uppercase font-sans text-white bg-crimson rounded-full px-4 py-1.5"
            >
              Sold Out
            </div>
            <div
              v-else
              :class="['absolute top-4 left-4 text-[9px] tracking-[0.25em] uppercase font-sans rounded-full px-4 py-1.5', badgeClasses[event.badgeColor]]"
            >
              {{ event.badge }}
            </div>

          </div>

          <!-- Card Body -->
          <div class="flex flex-col flex-1 p-5">

            <!-- City + Date -->
            <div class="flex items-center justify-between mb-2">
              <span class="text-[10px] tracking-[0.2em] uppercase font-sans text-crimson">
                {{ event.city }}
              </span>
              <span class="text-[10px] tracking-[0.15em] uppercase font-sans text-ink/65">
                {{ event.month }} {{ event.date }}
              </span>
            </div>

            <!-- Artist Name -->
            <h3 class="font-display italic text-xl md:text-2xl font-bold text-ink group-hover:text-gold transition-colors duration-300 leading-tight mb-2">
              {{ event.artist }}
            </h3>

            <!-- Subtitle -->
            <p v-if="event.subtitle" class="text-sm font-sans font-light text-ink-muted leading-relaxed mb-4">
              {{ event.subtitle }}
            </p>

            <!-- CTA -->
            <div class="mt-auto">
              <span
                v-if="event.isSoldOut"
                class="inline-block text-[10px] tracking-[0.25em] uppercase font-sans text-crimson/70 line-through"
              >
                Sold Out
              </span>
              <a
                v-else
                :href="event.ticketUrl"
                class="inline-flex items-center gap-3 text-[10px] tracking-[0.2em] uppercase font-sans text-ink border-b border-ink/30 group-hover:text-gold group-hover:border-gold transition-colors duration-300"
              >
                <span>Get Tickets</span>
                <span class="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
              </a>
            </div>

          </div>

        </div>
      </div>

    </div>
  </section>
</template>
