<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { eventDate, findEvent, isPastEvent, type Event } from '~/data/events'

const route = useRoute()
const found = findEvent(String(route.params.slug))

if (!found) {
  throw createError({ statusCode: 404, statusMessage: 'Event not found', fatal: true })
}

const event: Event = found

const isPast = computed(() => isPastEvent(event))

const fullDate = eventDate(event).toLocaleDateString('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const badgeClasses: Record<Event['badgeColor'], string> = {
  gold: 'text-bg-dark bg-gold',
  crimson: 'text-white bg-crimson',
  dark: 'text-ink-light bg-bg-dark',
}

const details = computed(() => {
  const rows: { label: string; value: string }[] = [
    { label: 'Date', value: fullDate },
  ]
  if (event.time) rows.push({ label: 'Time', value: event.time })
  rows.push({ label: 'Venue', value: event.venue })
  if (event.address) rows.push({ label: 'Address', value: event.address })
  rows.push({ label: 'Location', value: `${event.city}, ${event.country}` })
  if (event.ageLimit) rows.push({ label: 'Age limit', value: event.ageLimit })
  return rows
})

useSeoMeta({
  title: `${event.artist} — ${event.city} · Karimi Entertainment`,
  description: event.description ?? `${event.artist} · ${event.venue}, ${event.city} · ${fullDate}`,
  ogImage: event.image ?? undefined,
})

const posterRef = ref<HTMLElement | null>(null)
const infoRef = ref<HTMLElement | null>(null)

onMounted(async () => {
  if (import.meta.client) {
    const { gsap } = await import('gsap')
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        posterRef.value,
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.15 }
      )
      gsap.fromTo(
        infoRef.value,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.3 }
      )
    })
  }
})
</script>

<template>
  <main class="bg-bg text-ink min-h-screen">

    <div class="pt-28" />

    <section class="px-6 md:px-10 lg:px-16 py-10 md:py-16">
      <div class="max-w-5xl mx-auto">

        <!-- Back -->
        <NuxtLink
          to="/#events"
          class="inline-flex items-center gap-3 mb-10 text-[10px] tracking-[0.2em] uppercase font-sans text-ink/60 hover:text-crimson transition-colors duration-300"
        >
          <span>←</span>
          <span>All Events</span>
        </NuxtLink>

        <div class="grid grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] gap-10 md:gap-14 items-start">

          <!-- Poster -->
          <div ref="posterRef" class="md:sticky md:top-28">
            <div class="relative overflow-hidden rounded-2xl bg-elevated shadow-[0_12px_40px_rgba(0,36,41,0.18)]">
              <img
                v-if="event.image"
                :src="event.image"
                :alt="`${event.artist} poster`"
                :class="['w-full h-auto', isPast && 'grayscale-[.35]']"
              />
              <div
                v-else
                class="w-full aspect-[3/4] flex items-center justify-center"
              >
                <span class="font-display text-6xl font-light text-ink/10 tracking-widest uppercase">
                  {{ event.artist.charAt(0) }}
                </span>
              </div>

              <div
                v-if="isPast"
                class="absolute top-4 left-4 text-[9px] tracking-[0.25em] uppercase font-sans text-ink-light bg-bg-dark rounded-full px-4 py-1.5"
              >
                Past Event
              </div>
              <div
                v-else-if="event.isSoldOut"
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
          </div>

          <!-- Info -->
          <div ref="infoRef" class="flex flex-col">

            <div class="flex items-center gap-5 mb-5">
              <div class="w-8 h-px bg-crimson" />
              <span class="text-[10px] tracking-[0.35em] uppercase font-sans text-crimson">
                {{ event.city }} · {{ event.month }} {{ event.date }}, {{ event.year }}
              </span>
            </div>

            <h1 class="font-display italic text-display-sm font-bold text-ink leading-none mb-4">
              {{ event.artist }}
            </h1>

            <p v-if="event.subtitle" class="text-base font-sans font-light text-ink-muted leading-relaxed mb-8">
              {{ event.subtitle }}
            </p>

            <p v-if="event.description" class="text-sm font-sans font-light text-ink/80 leading-relaxed mb-10 max-w-prose">
              {{ event.description }}
            </p>

            <!-- Details -->
            <dl class="border-t border-ink/10 mb-10">
              <div
                v-for="row in details"
                :key="row.label"
                class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 py-4 border-b border-ink/10"
              >
                <dt class="sm:w-28 shrink-0 text-[10px] tracking-[0.2em] uppercase font-sans text-ink/50">
                  {{ row.label }}
                </dt>
                <dd class="text-sm font-sans text-ink">
                  {{ row.value }}
                </dd>
              </div>
            </dl>

            <!-- Line-up -->
            <div v-if="event.lineup?.length" class="mb-10">
              <h2 class="text-[10px] tracking-[0.2em] uppercase font-sans text-ink/50 mb-4">
                Line-up
              </h2>
              <ul class="flex flex-wrap gap-2">
                <li
                  v-for="name in event.lineup"
                  :key="name"
                  class="font-display italic text-lg text-ink border border-ink/20 rounded-full px-4 py-1"
                >
                  {{ name }}
                </li>
              </ul>
            </div>

            <!-- Prices -->
            <div v-if="event.prices?.length" class="mb-10">
              <h2 class="text-[10px] tracking-[0.2em] uppercase font-sans text-ink/50 mb-4">
                Tickets
              </h2>
              <div class="grid grid-cols-2 gap-3">
                <div
                  v-for="price in event.prices"
                  :key="price.label"
                  class="bg-surface rounded-xl px-5 py-4"
                >
                  <span class="block text-[10px] tracking-[0.2em] uppercase font-sans text-ink/55 mb-1">
                    {{ price.label }}
                  </span>
                  <span class="font-display text-2xl font-bold text-ink">
                    {{ price.amount }}
                  </span>
                </div>
              </div>
            </div>

            <!-- CTA -->
            <div class="flex flex-col sm:flex-row sm:items-center gap-5">
              <span
                v-if="isPast"
                class="inline-block text-[10px] tracking-[0.25em] uppercase font-sans text-ink/40"
              >
                Event Ended
              </span>
              <span
                v-else-if="event.isSoldOut"
                class="inline-block text-[10px] tracking-[0.25em] uppercase font-sans text-crimson/70 line-through"
              >
                Sold Out
              </span>
              <a
                v-else
                :href="event.ticketUrl"
                class="inline-flex items-center justify-center gap-3 text-[11px] tracking-[0.25em] uppercase font-sans text-bg-dark bg-gold rounded-full px-8 py-4 hover:bg-crimson hover:text-white transition-colors duration-300"
              >
                <span>Get Tickets</span>
                <span>→</span>
              </a>

              <a
                v-if="event.infoPhone"
                :href="`tel:${event.infoPhone.replace(/\s/g, '')}`"
                class="text-sm font-sans text-ink/70 hover:text-crimson transition-colors duration-300"
              >
                Info: {{ event.infoPhone }}
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>

  </main>
</template>
