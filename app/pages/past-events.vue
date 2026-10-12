<script setup lang="ts">
import { computed } from 'vue'
import { eventTime, isPastEvent } from '~/data/events'

useHead({ title: 'Past Events — Karimi Entertainment' })

const { events } = await useEvents()

const pastEvents = computed(() =>
  events
    .filter((event) => isPastEvent(event))
    .sort((a, b) => eventTime(b) - eventTime(a))
)

// Grouped by year, newest year first, so a long archive stays scannable.
const years = computed(() => {
  const groups = new Map<string, typeof pastEvents.value>()
  for (const event of pastEvents.value) {
    const year = event.year || 'Earlier'
    if (!groups.has(year)) groups.set(year, [])
    groups.get(year)!.push(event)
  }
  return [...groups].map(([year, list]) => ({ year, events: list }))
})
</script>

<template>
  <main class="bg-bg text-ink min-h-screen">

    <div class="pt-28" />

    <section class="px-6 md:px-10 lg:px-16 py-16 md:py-20">
      <div class="max-w-site mx-auto">

        <!-- Header -->
        <div class="flex items-end justify-between mb-16 md:mb-20">
          <div>
            <div class="flex items-center gap-5 mb-5">
              <div class="w-8 h-px bg-crimson" />
              <span class="text-[10px] tracking-[0.35em] uppercase font-sans text-crimson">
                Archive
              </span>
            </div>
            <h1 class="font-display text-display-sm text-ink font-light leading-none">
              Past <span class="italic">events</span>
            </h1>
          </div>
          <span class="hidden md:block text-[10px] tracking-[0.2em] uppercase font-sans text-ink/55 pb-2">
            {{ pastEvents.length }} Events
          </span>
        </div>

        <p v-if="!pastEvents.length" class="text-center font-sans font-light text-ink-muted py-12">
          No past events yet.
        </p>

        <!-- One block per year -->
        <div v-for="group in years" :key="group.year" class="mb-16 md:mb-20 last:mb-0">

          <div class="flex items-center gap-6 mb-8">
            <h2 class="font-display text-3xl md:text-4xl text-ink/80 font-light leading-none">
              {{ group.year }}
            </h2>
            <div class="flex-1 h-px bg-ink/10" />
          </div>

          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            <div
              v-for="event in group.events"
              :key="event.slug"
              class="group relative flex flex-col bg-surface/60 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,36,41,0.08)] hover:shadow-[0_12px_40px_rgba(0,36,41,0.14)] transition-shadow duration-500"
            >

              <!-- Whole card opens the event page -->
              <NuxtLink
                :to="`/events/${event.slug}`"
                :aria-label="`${event.artist} — ${event.city}, ${event.month} ${event.date}, ${event.year}`"
                class="absolute inset-0 z-[5] rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
              />

              <!-- Image -->
              <div class="relative w-full overflow-hidden bg-elevated">
                <CmsImg
                  v-if="event.image"
                  :src="event.image"
                  :alt="event.artist"
                  sizes="xs:50vw sm:50vw md:33vw lg:300px"
                  class="w-full h-auto grayscale-[.35] group-hover:grayscale-0 transition-[filter] duration-500"
                />
                <div
                  v-else
                  class="w-full aspect-[4/3] flex items-center justify-center"
                >
                  <span class="font-display text-4xl font-light text-ink/10 tracking-widest uppercase">
                    {{ event.artist.charAt(0) }}
                  </span>
                </div>
              </div>

              <!-- Card Body -->
              <div class="flex flex-col flex-1 p-3 md:p-5">
                <div class="flex flex-wrap items-center justify-between gap-x-2 mb-1.5 md:mb-2">
                  <span class="text-[9px] md:text-[10px] tracking-[0.2em] uppercase font-sans text-ink/55">
                    {{ event.city }}
                  </span>
                  <span class="text-[9px] md:text-[10px] tracking-[0.15em] uppercase font-sans text-ink/45">
                    {{ event.month }} {{ event.date }}
                  </span>
                </div>

                <h3 class="font-display italic text-base md:text-xl font-bold text-ink/80 group-hover:text-gold transition-colors duration-300 leading-tight">
                  {{ event.artist }}
                </h3>

                <p v-if="event.subtitle" class="hidden md:block text-sm font-sans font-light text-ink-muted/80 leading-relaxed mt-2">
                  {{ event.subtitle }}
                </p>
              </div>

            </div>
          </div>
        </div>

        <div class="mt-16 md:mt-20 text-center">
          <NuxtLink
            to="/#events"
            class="inline-flex items-center gap-3 text-[10px] tracking-[0.2em] uppercase font-sans text-ink border border-ink/40 rounded-full px-6 py-3 hover:bg-ink hover:text-bg transition-all duration-300"
          >
            <span>See upcoming events</span>
            <span>→</span>
          </NuxtLink>
        </div>

      </div>
    </section>
  </main>
</template>
