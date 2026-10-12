<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useReducedMotion } from '~/composables/useReducedMotion'

const { prefersReducedMotion } = useReducedMotion()
const isLoaded = ref(false)

// Mobile hero: a crossfading slider of concert photos. Desktop keeps the
// single artists image. Only the first slide is in the server HTML (it is
// the largest element, so it must not wait for JavaScript); the rest are
// added in the browser on phones only, so desktop never downloads them.
const slides = [
  { src: '/images/hero-slides/crowd-1.jpeg', alt: 'Karimi Entertainment concert — a full hall in warm stage light' },
  { src: '/images/hero-slides/crowd-2.jpeg', alt: 'Karimi Entertainment concert — the audience on its feet' },
  { src: '/images/hero-slides/crowd-3.jpeg', alt: 'Karimi Entertainment concert — a packed arena in blue light' },
  { src: '/images/hero-slides/crowd-4.jpeg', alt: 'Karimi Entertainment concert — a sold-out theatre' },
  { src: '/images/hero-slides/crowd-5.jpeg', alt: 'Karimi Entertainment concert — a historic concert hall' },
]
const INTERVAL = 5000

const isMobile = ref(false)
const current = ref(0)
const extraSlides = computed(() => (isMobile.value ? slides.slice(1) : []))

let timer: ReturnType<typeof setInterval> | undefined
let mq: MediaQueryList | undefined

const stop = () => { if (timer) clearInterval(timer); timer = undefined }
const start = () => {
  stop()
  if (!isMobile.value || prefersReducedMotion.value) return
  timer = setInterval(() => { current.value = (current.value + 1) % slides.length }, INTERVAL)
}
const goTo = (i: number) => { current.value = (i + slides.length) % slides.length; start() }

// Swipe left/right to change slide.
let touchX: number | null = null
const onTouchStart = (e: TouchEvent) => { touchX = e.touches[0]?.clientX ?? null }
const onTouchEnd = (e: TouchEvent) => {
  const endX = e.changedTouches[0]?.clientX
  if (touchX === null || endX === undefined) return
  const dx = endX - touchX
  touchX = null
  if (Math.abs(dx) > 40) goTo(current.value + (dx < 0 ? 1 : -1))
}

const onMq = (e: MediaQueryListEvent | MediaQueryList) => {
  isMobile.value = e.matches
  if (!e.matches) current.value = 0
  start()
}

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true
  }, 100)
  mq = window.matchMedia('(max-width: 767px)')
  onMq(mq)
  mq.addEventListener('change', onMq)
})

watch(prefersReducedMotion, start)

onBeforeUnmount(() => {
  stop()
  mq?.removeEventListener('change', onMq)
})
</script>

<template>
  <section class="relative w-full bg-[#2B1A1E] overflow-hidden">

    <!-- Mobile: tall crop with a photo slider -->
    <!-- Desktop: full screen height, single artists image -->
    <div class="relative w-full h-[75vh] min-h-[420px] md:h-screen md:min-h-[500px]">

      <!-- Hero Image — shown at once (no fade-in): it is the page's largest
           element, and a fade that waits for JavaScript delays the load score -->
      <div
        class="absolute left-0 right-0 bottom-0 top-[86px] md:top-[84px]"
        @touchstart.passive="onTouchStart"
        @touchend="onTouchEnd"
      >
        <picture>
          <source media="(min-width: 768px)" srcset="/images/hero1.jpeg" />
          <img
            :src="slides[0]!.src"
            :alt="slides[0]!.alt"
            :class="['hero-slide md:!opacity-100', current === 0 ? 'opacity-100' : 'opacity-0']"
            class="absolute inset-0 w-full h-full object-cover object-center"
            loading="eager"
            fetchpriority="high"
          />
        </picture>
        <img
          v-for="(slide, i) in extraSlides"
          :key="slide.src"
          :src="slide.src"
          :alt="slide.alt"
          :aria-hidden="current !== i + 1"
          :class="['hero-slide md:hidden absolute inset-0 w-full h-full object-cover object-center', current === i + 1 ? 'opacity-100' : 'opacity-0']"
          decoding="async"
        />
      </div>

      <!-- Bottom fade -->
      <div class="absolute bottom-0 left-0 right-0 h-32 md:h-40 bg-gradient-to-t from-[#2B1A1E] to-transparent pointer-events-none" />

      <!-- Slide dots — mobile only -->
      <div v-if="isMobile" class="md:hidden absolute bottom-6 left-0 right-0 z-10 flex justify-center gap-1">
        <button
          v-for="(slide, i) in slides"
          :key="slide.src"
          type="button"
          :aria-label="`Show photo ${i + 1} of ${slides.length}`"
          :aria-current="current === i"
          class="flex h-6 items-center px-1"
          @click="goTo(i)"
        >
          <span :class="['block h-1 rounded-full transition-all duration-500', current === i ? 'w-6 bg-gold' : 'w-2 bg-ink-light/40']" />
        </button>
      </div>

      <!-- Scroll Indicator — desktop only -->
      <div
        :class="[
          'hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 transition-all duration-1000 delay-[1800ms] ease-expo-out',
          isLoaded || prefersReducedMotion ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        ]"
      >
        <span class="text-[9px] tracking-[0.3em] uppercase font-sans text-ink-light/40">Scroll</span>
        <div class="w-px h-10 bg-gradient-to-b from-ink-light/40 to-transparent animate-pulse" />
      </div>

    </div>

  </section>
</template>

<style scoped>
.hero-slide {
  transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}
@media (prefers-reduced-motion: reduce) {
  .hero-slide {
    transition: none;
  }
}
</style>
