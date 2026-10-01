<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { DEFAULT_ORGANIZER, eventDate, findEvent, isPastEvent, type Event } from '~/data/events'

const route = useRoute()
const found = findEvent(String(route.params.slug))

if (!found) {
  throw createError({ statusCode: 404, statusMessage: 'Event not found', fatal: true })
}

const event: Event = found

const isPast = computed(() => isPastEvent(event))

const dateChip = eventDate(event).toLocaleDateString('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const mapQuery = event.location ? encodeURIComponent(event.location.mapQuery) : ''
const mapEmbedUrl = `https://maps.google.com/maps?q=${mapQuery}&z=15&output=embed`
const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`

// Countdown — only runs in the browser so server and client markup match.
const now = ref<number | null>(null)
let timer: ReturnType<typeof setInterval> | undefined

const countdown = computed(() => {
  if (now.value === null || !event.startsAt || isPast.value) return null
  const diff = Date.parse(event.startsAt) - now.value
  if (diff <= 0) return null
  const s = Math.floor(diff / 1000)
  return [
    { value: Math.floor(s / 86400), unit: 'D' },
    { value: Math.floor((s % 86400) / 3600), unit: 'H' },
    { value: Math.floor((s % 3600) / 60), unit: 'M' },
    { value: s % 60, unit: 'S' },
  ]
})

useSeoMeta({
  title: `${event.artist} — ${event.city} · Karimi Entertainment`,
  description: event.description?.[0] ?? `${event.artist} · ${event.venue}, ${event.city} · ${dateChip}`,
  ogImage: event.image ?? undefined,
})

const infoRef = ref<HTMLElement | null>(null)

onMounted(async () => {
  now.value = Date.now()
  timer = setInterval(() => { now.value = Date.now() }, 1000)

  const { gsap } = await import('gsap')
  const mm = gsap.matchMedia()
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.fromTo(
      infoRef.value,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.15 }
    )
  })
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <main class="bg-bg-dark text-ink-light min-h-screen pt-[84px]">
    <div class="md:grid md:grid-cols-2">

      <!-- Poster -->
      <div class="relative overflow-hidden bg-black md:sticky md:top-[84px] md:h-[calc(100vh-84px)]">
        <template v-if="event.image">
          <!-- Blurred fill so the tall poster never leaves empty bars -->
          <img
            :src="event.image"
            alt=""
            aria-hidden="true"
            class="hidden md:block absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-40"
          />
          <img
            :src="event.image"
            :alt="`${event.artist} poster`"
            :class="['relative w-full h-auto md:h-full md:object-contain', isPast && 'grayscale-[.35]']"
          />
        </template>
        <div v-else class="w-full aspect-[3/4] md:h-full flex items-center justify-center">
          <span class="font-display text-7xl font-light text-ink-light/10 tracking-widest uppercase">
            {{ event.artist.charAt(0) }}
          </span>
        </div>

        <!-- Back -->
        <NuxtLink
          to="/#events"
          class="absolute top-4 left-4 inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-sans text-ink-light bg-bg-dark/80 backdrop-blur-md rounded-full px-4 py-2 hover:bg-gold hover:text-bg-dark transition-colors duration-300"
        >
          <span>←</span>
          <span>All Events</span>
        </NuxtLink>

        <div
          v-if="isPast"
          class="absolute top-4 right-4 text-[9px] tracking-[0.25em] uppercase font-sans text-ink-light bg-bg-dark rounded-full px-4 py-1.5"
        >
          Past Event
        </div>

        <!-- Countdown -->
        <div
          v-if="countdown"
          class="absolute bottom-4 left-4 right-4 md:right-auto flex gap-1.5"
          aria-label="Time until the event starts"
        >
          <div
            v-for="part in countdown"
            :key="part.unit"
            class="flex-1 md:flex-none md:min-w-[5.5rem] text-center bg-bg-dark/85 backdrop-blur-md border border-gold/25 rounded-lg px-3 py-2 md:py-3"
          >
            <span class="font-display text-3xl md:text-5xl font-bold text-gold tabular-nums leading-none">
              {{ String(part.value).padStart(2, '0') }}
            </span>
            <span class="font-sans text-xs md:text-sm text-ink-light/70 ml-0.5">{{ part.unit }}</span>
          </div>
        </div>
      </div>

      <!-- Info -->
      <div class="flex flex-col md:min-h-[calc(100vh-84px)]">
        <div ref="infoRef" class="flex-1 px-6 md:px-12 lg:px-16 py-10 md:py-14">

          <!-- Date / time chips -->
          <div class="flex flex-wrap text-[11px] tracking-[0.12em] uppercase font-sans mb-8">
            <span class="bg-ink-light text-bg-dark px-3 py-1.5 rounded-l-md">{{ dateChip }}</span>
            <span v-if="event.time" class="bg-bg-dark-elevated text-ink-light border border-gold/40 px-3 py-1.5">{{ event.time }}</span>
            <span v-if="event.timezone" class="border border-ink-light/20 text-ink-light/60 px-3 py-1.5 rounded-r-md">{{ event.timezone }}</span>
          </div>

          <h1 class="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.95] mb-5">
            {{ event.artist }}
            <span class="block italic font-light text-crimson">{{ event.city }}</span>
          </h1>

          <p class="text-[11px] tracking-[0.25em] uppercase font-sans text-ink-light/70">
            By {{ event.organizer ?? DEFAULT_ORGANIZER }}
          </p>

          <!-- About -->
          <section v-if="event.description?.length" class="border-t border-ink-light/15 mt-10 pt-8">
            <h2 class="section-label">About this event</h2>
            <p
              v-for="(paragraph, i) in event.description"
              :key="i"
              class="text-base md:text-lg font-sans font-light text-ink-light/85 leading-relaxed mb-4 last:mb-0"
            >
              {{ paragraph }}
            </p>
          </section>

          <!-- Line-up -->
          <section v-if="event.lineup?.length" class="border-t border-ink-light/15 mt-10 pt-8">
            <h2 class="section-label">Line-up</h2>
            <ul class="flex flex-wrap gap-2">
              <li
                v-for="name in event.lineup"
                :key="name"
                class="font-display italic text-xl text-ink-light border border-ink-light/25 rounded-full px-5 py-1.5"
              >
                {{ name }}
              </li>
            </ul>
          </section>

          <!-- Tickets -->
          <section v-if="event.prices?.length || event.priceNote" class="border-t border-ink-light/15 mt-10 pt-8">
            <h2 class="section-label">Tickets</h2>
            <div v-if="event.prices?.length" class="grid grid-cols-2 gap-3">
              <div
                v-for="price in event.prices"
                :key="price.label"
                class="bg-bg-dark-surface border border-ink-light/10 rounded-xl px-5 py-4"
              >
                <span class="block text-[10px] tracking-[0.2em] uppercase font-sans text-ink-light/55 mb-1">
                  {{ price.label }}
                </span>
                <span class="font-display text-3xl font-bold text-gold">
                  {{ price.amount }}
                </span>
              </div>
            </div>
            <p v-if="event.priceNote" class="text-sm font-sans font-light text-ink-light/70 leading-relaxed mt-3">
              From <span class="text-gold font-medium">{{ event.fromPrice }}</span> {{ event.priceNote }}
            </p>
          </section>

          <!-- Good to know -->
          <section
            v-if="event.ageLimit || event.infoPhone || event.goodToKnow?.length"
            class="border-t border-ink-light/15 mt-10 pt-8"
          >
            <h2 class="section-label">Good to know</h2>
            <ul class="flex flex-col gap-3 text-sm md:text-base font-sans font-light text-ink-light/85">
              <li v-if="event.ageLimit" class="flex gap-3">
                <span class="text-crimson">●</span>
                <span>Age limit: {{ event.ageLimit }}</span>
              </li>
              <li v-for="item in event.goodToKnow" :key="item" class="flex gap-3">
                <span class="text-crimson">●</span>
                <span>{{ item }}</span>
              </li>
              <li v-if="event.infoPhone" class="flex gap-3">
                <span class="text-crimson">●</span>
                <span>
                  Info:
                  <a
                    :href="`tel:${event.infoPhone.replace(/\s/g, '')}`"
                    class="text-gold hover:underline"
                  >{{ event.infoPhone }}</a>
                </span>
              </li>
            </ul>
          </section>

          <!-- Location -->
          <section v-if="event.location" class="border-t border-ink-light/15 mt-10 pt-8">
            <h2 class="section-label">Location</h2>
            <div class="flex items-start justify-between gap-6 mb-5">
              <div>
                <p class="font-display text-2xl font-bold">{{ event.location.name }}</p>
                <p class="text-sm font-sans font-light text-ink-light/60 mt-1">{{ event.location.address }}</p>
              </div>
              <a
                :href="directionsUrl"
                target="_blank"
                rel="noopener"
                class="shrink-0 inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-sans text-ink-light hover:text-gold transition-colors duration-300 pt-2"
              >
                <span>→</span>
                <span>Get directions</span>
              </a>
            </div>
            <iframe
              :src="mapEmbedUrl"
              :title="`Map of ${event.location.name}`"
              class="w-full h-64 md:h-72 rounded-2xl border-0 bg-bg-dark-surface"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            />
          </section>

        </div>

        <!-- Ticket bar -->
        <div class="sticky bottom-0 z-20 bg-bg-dark/95 backdrop-blur-md border-t border-ink-light/15 px-6 md:px-12 lg:px-16 py-4">
          <div v-if="isPast" class="flex items-center justify-between gap-4 py-2">
            <span class="text-[11px] tracking-[0.25em] uppercase font-sans text-ink-light/50">Event Ended</span>
            <NuxtLink
              to="/#events"
              class="text-[10px] tracking-[0.2em] uppercase font-sans text-gold hover:underline"
            >
              See upcoming events →
            </NuxtLink>
          </div>
          <div v-else-if="event.isSoldOut" class="py-2 text-[11px] tracking-[0.25em] uppercase font-sans text-crimson">
            Sold Out
          </div>
          <div v-else class="flex items-center gap-3 md:gap-4">
            <div v-if="event.fromPrice" class="shrink-0">
              <span class="block text-[10px] tracking-[0.15em] uppercase font-sans text-ink-light/60">From</span>
              <span class="font-display text-2xl md:text-3xl font-bold text-ink-light leading-none">{{ event.fromPrice }}</span>
            </div>
            <a
              :href="event.ticketUrl"
              class="flex-1 text-center text-[11px] md:text-xs tracking-[0.25em] uppercase font-sans font-medium text-bg-dark bg-gold rounded-xl py-4 hover:bg-gold-light transition-colors duration-300"
            >
              Buy Tickets
            </a>
            <a
              :href="event.ticketUrl"
              aria-label="Buy tickets"
              class="hidden sm:flex shrink-0 w-12 h-12 md:w-14 md:h-14 items-center justify-center rounded-full bg-ink-light text-bg-dark hover:bg-crimson hover:text-white transition-colors duration-300"
            >
              →
            </a>
          </div>
        </div>
      </div>

    </div>
  </main>
</template>

<style scoped>
.section-label {
  @apply text-[11px] tracking-[0.25em] uppercase font-sans text-ink-light/60 mb-4;
}
</style>
