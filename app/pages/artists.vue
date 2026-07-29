<script setup lang="ts">
import { onMounted, ref } from 'vue'

useHead({ title: 'Artists — Karimi Entertainment' })

interface Artist {
  id: string
  name: string
  origin: string
  genre: string
  bio: string
  image: string
  imageStyle: Record<string, string>
  hasUpcomingEvent: boolean
}

const artists: Artist[] = [
  {
    id: '1',
    name: 'Habib Qaderi',
    origin: 'Afghanistan',
    genre: 'Folk · Traditional',
    bio: 'A voice rooted in Afghan tradition, blending timeless folk melodies with heartfelt storytelling.',
    image: '/images/hero.jpeg',
    imageStyle: { objectPosition: '0% center', transform: 'scale(1.7)', transformOrigin: '5% center' },
    hasUpcomingEvent: true,
  },
  {
    id: '2',
    name: 'Farhad Darya',
    origin: 'Afghanistan',
    genre: 'Folk · Classical',
    bio: 'One of Afghanistan\'s most celebrated artists, renowned for classical arrangements and powerful live performances.',
    image: '/images/hero.jpeg',
    imageStyle: { objectPosition: '37% center', transform: 'scale(1.7)', transformOrigin: '37% center' },
    hasUpcomingEvent: true,
  },
  {
    id: '3',
    name: 'Aryana',
    origin: 'Afghanistan',
    genre: 'Pop · Folk',
    bio: 'A rising force blending contemporary pop with Afghan folk roots, captivating audiences across Europe.',
    image: '/images/hero.jpeg',
    imageStyle: { objectPosition: '63% center', transform: 'scale(1.7)', transformOrigin: '63% center' },
    hasUpcomingEvent: true,
  },
  {
    id: '4',
    name: 'Valy',
    origin: 'Afghanistan',
    genre: 'Pop · Contemporary',
    bio: 'A bold, contemporary sound reshaping modern Afghan pop for a new generation of listeners.',
    image: '/images/hero.jpeg',
    imageStyle: { objectPosition: '90% center', transform: 'scale(1.7)', transformOrigin: '90% center' },
    hasUpcomingEvent: true,
  },
]

const sectionRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const cardRefs = ref<HTMLElement[]>([])

const setCardRef = (el: HTMLElement | null, index: number) => {
  if (el) cardRefs.value[index] = el
}

onMounted(async () => {
  if (process.client) {
    const { gsap } = await import('gsap')
    const { ScrollTrigger } = await import('gsap/ScrollTrigger')
    gsap.registerPlugin(ScrollTrigger)

    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        headerRef.value,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.2 }
      )
      gsap.fromTo(
        cardRefs.value,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12, delay: 0.35 }
      )
    })
  }
})
</script>

<template>
  <main class="bg-bg text-ink min-h-screen">

    <div class="pt-28" />

    <section
      ref="sectionRef"
      class="px-6 md:px-10 lg:px-16 py-16 md:py-20"
    >
      <div class="max-w-site mx-auto">

        <!-- Header -->
        <div ref="headerRef" class="flex items-end justify-between mb-16 md:mb-20">
          <div>
            <div class="flex items-center gap-5 mb-5">
              <div class="w-8 h-px bg-crimson" />
              <span class="text-[10px] tracking-[0.35em] uppercase font-sans text-crimson">
                Our Roster
              </span>
            </div>
            <h1 class="font-display text-display-sm text-ink font-light leading-none">
              The Artists
            </h1>
          </div>
          <span class="hidden md:block text-[10px] tracking-[0.2em] uppercase font-sans text-ink/55 pb-2">
            {{ artists.length }} Artists
          </span>
        </div>

        <!-- Grid -->
        <div class="grid grid-cols-1 gap-8">
          <div
            v-for="(artist, index) in artists"
            :key="artist.id"
            :ref="(el) => setCardRef(el as HTMLElement, index)"
            class="group relative flex flex-col sm:flex-row gap-6 sm:gap-10 cursor-default bg-bg-dark rounded-2xl p-6 md:p-8"
          >

            <!-- Image with decorative offset frames -->
            <div class="relative w-full sm:w-56 md:w-64 shrink-0 aspect-[3/4]">
              <div class="absolute -top-4 -left-4 w-full h-full rounded-2xl border border-crimson/60 -rotate-3 pointer-events-none" />
              <div class="absolute -top-2 -left-2 w-full h-full rounded-2xl border border-gold/60 -rotate-1 pointer-events-none" />

              <div class="relative w-full h-full overflow-hidden rounded-2xl bg-bg-dark-surface">

                <!-- Hover zoom wrapper -->
                <div class="absolute inset-0 transition-transform duration-700 ease-expo-out group-hover:scale-[1.06]">
                  <img
                    :src="artist.image"
                    :alt="artist.name"
                    class="absolute inset-0 w-full h-full object-cover"
                    :style="artist.imageStyle"
                  />
                </div>

                <!-- Hover overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-bg-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <!-- Upcoming badge -->
                <div
                  v-if="artist.hasUpcomingEvent"
                  class="absolute top-4 left-4 text-[9px] tracking-[0.25em] uppercase font-sans text-bg-dark bg-gold rounded-full px-4 py-1.5"
                >
                  Upcoming
                </div>

                <!-- Bottom gold line on hover -->
                <div class="absolute bottom-0 left-0 right-0 h-px bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-expo-out origin-left" />
              </div>
            </div>

            <!-- Info -->
            <div class="flex flex-col justify-center gap-2">
              <h2 class="font-display text-2xl md:text-3xl font-bold text-ink-light group-hover:text-gold transition-colors duration-300 leading-tight">
                {{ artist.name }}
              </h2>
              <p class="text-[10px] tracking-[0.2em] uppercase font-sans text-ink-light/50">
                {{ artist.origin }}
              </p>
              <p class="text-[10px] tracking-[0.15em] font-sans text-ink-light/40 mt-0.5 mb-1">
                {{ artist.genre }}
              </p>
              <p class="text-sm font-sans font-light text-ink-light/60 leading-relaxed max-w-md">
                {{ artist.bio }}
              </p>
            </div>

          </div>
        </div>

        <!-- Bottom CTA -->
        <div class="mt-20 pt-16 border-t border-ink/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <p class="text-sm font-sans font-light text-ink/60 max-w-sm leading-relaxed">
            Interested in booking one of our artists for your event?
          </p>
          <NuxtLink
            to="/contact"
            class="booking-cta text-[10px] tracking-[0.25em] uppercase font-sans font-light px-6 py-3 border border-ink/40 text-ink hover:bg-gold hover:text-bg-dark hover:border-gold transition-all duration-400"
          >
            Book an Artist
          </NuxtLink>
        </div>

      </div>
    </section>

  </main>
</template>

<style scoped>
.booking-cta {
  transition: background-color 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              color 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
