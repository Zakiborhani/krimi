<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useReducedMotion } from '~/composables/useReducedMotion'

const { prefersReducedMotion } = useReducedMotion()
const isLoaded = ref(false)

// Mobile hero: a crossfading slider of concert photos. Desktop keeps the
// single artists image. Only the first slide is in the server HTML (it is
// the largest element, so it must not wait for JavaScript). The others are
// added in the browser on phones only, one step ahead of the slide shown,
// so desktop never downloads them and phones only fetch what they show.
// Files are numbered in the order they were added; this is the play order.
// `pos` sets the crop for photos whose subject is off-centre.
const SLIDE_ORDER: { n: number; pos?: string }[] = [
  1, 2, 3, 4, { n: 24, pos: '62% center' }, 5, 6, 7, 8, 9, 10, 11, { n: 25, pos: '28% center' }, 12, 13, 14, 15, 16, 17, 18, 26, 19, 20, 21, 22, 23,
].map(e => (typeof e === 'number' ? { n: e } : e))
const slides = SLIDE_ORDER.map(({ n, pos }, i) => ({
  src: `/images/hero-slides/slide-${String(n).padStart(2, '0')}.jpeg`,
  alt: `Karimi Entertainment live concert — photo ${i + 1}`,
  pos: pos ?? 'center',
}))
const INTERVAL = 3000

// Slides and the desktop image go through image optimisation (AVIF/WebP).
// Slides keep their full width (see image.screens.slide in nuxt.config.ts).
const img = useImage()
const slideSrc = (src: string) => img(src, { width: 1800, quality: 70 })
const desktopSrcset = [1024, 1280, 1536].map(w => `${img('/images/hero1.jpeg', { width: w, quality: 75 })} ${w}w`).join(', ')

const isMobile = ref(false)
const current = ref(0)
const loaded = ref(new Set<number>([0]))
const extraSlides = computed(() =>
  isMobile.value ? slides.map((slide, i) => ({ ...slide, i })).filter(({ i }) => i > 0 && loaded.value.has(i)) : []
)
const preload = (i: number) => {
  const n = (i + slides.length) % slides.length
  if (!loaded.value.has(n)) loaded.value = new Set(loaded.value).add(n)
}
watch(current, (i) => { preload(i); preload(i + 1) })

// Hero music. Browsers block sound until the visitor has interacted with the
// page, so if the first play() is refused it starts on the first tap, click
// or key press instead. Once the visitor pauses it, it stays paused.
const audioRef = ref<HTMLAudioElement | null>(null)
const musicBtnRef = ref<HTMLButtonElement | null>(null)
const isPlaying = ref(false)
let userPaused = false

const GESTURES = ['pointerdown', 'keydown', 'touchstart'] as const
const removeGestureListeners = () => GESTURES.forEach(g => window.removeEventListener(g, onFirstGesture))
const onFirstGesture = (e: Event) => {
  removeGestureListeners()
  // A tap on the music button itself is handled by toggleMusic
  if (musicBtnRef.value?.contains(e.target as Node)) return
  if (!userPaused) audioRef.value?.play().catch(() => {})
}
const toggleMusic = () => {
  const audio = audioRef.value
  if (!audio) return
  removeGestureListeners()
  if (isPlaying.value) {
    userPaused = true
    audio.pause()
  } else {
    userPaused = false
    audio.play().catch(() => {})
  }
}

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
  else preload(1)
  start()
}

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true
  }, 100)
  mq = window.matchMedia('(max-width: 767px)')
  onMq(mq)
  mq.addEventListener('change', onMq)

  audioRef.value?.play().catch(() => {
    GESTURES.forEach(g => window.addEventListener(g, onFirstGesture, { passive: true }))
  })
})

watch(prefersReducedMotion, start)

onBeforeUnmount(() => {
  stop()
  mq?.removeEventListener('change', onMq)
  removeGestureListeners()
  audioRef.value?.pause()
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
          <source media="(min-width: 768px)" :srcset="desktopSrcset" sizes="100vw" />
          <img
            :src="slideSrc(slides[0]!.src)"
            :alt="slides[0]!.alt"
            :class="['hero-slide md:!opacity-100', current === 0 ? 'opacity-100' : 'opacity-0']"
            class="absolute inset-0 w-full h-full object-cover object-center"
            loading="eager"
            fetchpriority="high"
          />
        </picture>
        <img
          v-for="slide in extraSlides"
          :key="slide.src"
          :src="slideSrc(slide.src)"
          :alt="slide.alt"
          :aria-hidden="current !== slide.i"
          :style="{ objectPosition: slide.pos }"
          :class="['hero-slide md:hidden absolute inset-0 w-full h-full object-cover', current === slide.i ? 'opacity-100' : 'opacity-0']"
          decoding="async"
        />
      </div>

      <!-- Bottom fade -->
      <div class="absolute bottom-0 left-0 right-0 h-32 md:h-40 bg-gradient-to-t from-[#2B1A1E] to-transparent pointer-events-none" />

      <!-- Slide controls — mobile only (23 dots would not fit, so arrows + counter) -->
      <div v-if="isMobile" class="md:hidden absolute bottom-5 left-0 right-0 z-10 flex items-center justify-center gap-4">
        <button type="button" aria-label="Previous photo" class="flex size-9 items-center justify-center rounded-full bg-black/30 text-ink-light/80" @click="goTo(current - 1)">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
        </button>
        <span class="min-w-14 text-center text-[11px] tracking-[0.25em] font-sans text-ink-light/80 tabular-nums" aria-live="polite">
          {{ String(current + 1).padStart(2, '0') }} / {{ slides.length }}
        </span>
        <button type="button" aria-label="Next photo" class="flex size-9 items-center justify-center rounded-full bg-black/30 text-ink-light/80" @click="goTo(current + 1)">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
        </button>
      </div>

      <!-- Music -->
      <audio
        ref="audioRef"
        src="/audio/founder-intro.mp3"
        preload="auto"
        @play="isPlaying = true"
        @pause="isPlaying = false"
        @ended="isPlaying = false"
      />
      <button
        ref="musicBtnRef"
        type="button"
        class="absolute z-10 bottom-5 right-4 md:bottom-8 md:right-10 lg:right-16 flex items-center gap-2.5 h-9 pl-3 pr-4 rounded-full bg-black/35 backdrop-blur-sm text-ink-light/85 hover:text-gold transition-colors duration-300"
        :aria-label="isPlaying ? 'Pause music' : 'Play music'"
        :aria-pressed="isPlaying"
        @click="toggleMusic"
      >
        <span v-if="isPlaying" class="flex items-end gap-0.5 h-3" aria-hidden="true">
          <span class="w-0.5 bg-current audio-bar audio-bar-1" />
          <span class="w-0.5 bg-current audio-bar audio-bar-2" />
          <span class="w-0.5 bg-current audio-bar audio-bar-3" />
        </span>
        <svg v-else viewBox="0 0 24 24" class="w-3 h-3" fill="currentColor" aria-hidden="true">
          <path d="M8 5v14l11-7z" />
        </svg>
        <span class="hidden sm:inline text-[9px] tracking-[0.25em] uppercase font-sans">
          {{ isPlaying ? 'Pause' : 'Play' }} music
        </span>
      </button>

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

.audio-bar {
  animation: audio-bar-bounce 0.9s ease-in-out infinite;
}
.audio-bar-1 { height: 40%; animation-delay: 0s; }
.audio-bar-2 { height: 100%; animation-delay: 0.15s; }
.audio-bar-3 { height: 65%; animation-delay: 0.3s; }

@keyframes audio-bar-bounce {
  0%, 100% { height: 30%; }
  50% { height: 100%; }
}

@media (prefers-reduced-motion: reduce) {
  .hero-slide {
    transition: none;
  }
  .audio-bar {
    animation: none;
  }
}
</style>
