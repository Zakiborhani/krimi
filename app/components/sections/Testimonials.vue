<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface Testimonial {
  id: string
  quote: string
  author: string
  location: string
  event: string
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    quote: 'An unforgettable evening. The atmosphere, the music, the energy — it felt like being transported back home while standing in the heart of Amsterdam.',
    author: 'Layla M.',
    location: 'Stockholm',
    event: 'Valy in Stockholm',
  },
  {
    id: '2',
    quote: 'Karimi Entertainment delivered a world-class production. Every detail was perfect — from the stage design to the sound quality. Truly a premium experience.',
    author: 'Reza K.',
    location: 'Stockholm',
    event: 'Aryana in Stockholm',
  },
  {
    id: '3',
    quote: 'I have attended many concerts across Europe, but nothing compares to what Karimi brings. They understand their audience deeply and create something magical.',
    author: 'Shirin A.',
    location: 'Paris',
    event: 'Farhad Darya Night',
  },
]

const sectionRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const cardRefs = ref<HTMLElement[]>([])
const spotlights = ref<Record<number, object>>({})

const setCardRef = (el: HTMLElement | null, index: number) => {
  if (el) cardRefs.value[index] = el
}

// Per-card lerp state
const lerpState: Record<number, {
  cx: number, cy: number,
  tx: number, ty: number,
  active: boolean,
  raf: number | null
}> = {}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

const startLerp = (index: number) => {
  const state = lerpState[index]
  if (!state) return
  if (state.raf) cancelAnimationFrame(state.raf)

  const tick = () => {
    state.cx = lerp(state.cx, state.tx, 0.09)
    state.cy = lerp(state.cy, state.ty, 0.09)

    spotlights.value[index] = {
      background: `radial-gradient(circle 280px at ${state.cx}px ${state.cy}px, rgba(255,0,166,0.18) 0%, rgba(255,0,166,0.07) 40%, transparent 75%)`,
      opacity: 1,
    }

    if (state.active) {
      state.raf = requestAnimationFrame(tick)
    }
  }

  state.raf = requestAnimationFrame(tick)
}

const onMouseMove = (e: MouseEvent, index: number) => {
  const card = e.currentTarget as HTMLElement
  const rect = card.getBoundingClientRect()

  if (!lerpState[index]) {
    lerpState[index] = { cx: rect.width / 2, cy: rect.height / 2, tx: 0, ty: 0, active: false, raf: null }
  }

  const state = lerpState[index]
  state.tx = e.clientX - rect.left
  state.ty = e.clientY - rect.top

  if (!state.active) {
    state.active = true
    startLerp(index)
  }
}

const onMouseLeave = (index: number) => {
  const state = lerpState[index]
  if (state) {
    state.active = false
    if (state.raf) cancelAnimationFrame(state.raf)
  }
  spotlights.value[index] = { opacity: 0 }
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
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.value, start: 'top 80%' },
        }
      )
      gsap.fromTo(
        cardRefs.value,
        { opacity: 0, y: 36 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.15,
          scrollTrigger: { trigger: sectionRef.value, start: 'top 70%' },
        }
      )
    })
  }
})
</script>

<template>
  <section
    id="testimonials"
    ref="sectionRef"
    class="relative bg-bg-dark py-section px-6 md:px-10 lg:px-16"
  >
    <div class="max-w-site mx-auto">

      <!-- Section Header -->
      <div ref="headerRef" class="flex flex-col items-center text-center mb-16 md:mb-20">
        <div class="flex items-center gap-5 mb-5">
          <div class="w-8 h-px bg-gold" />
          <span class="text-[10px] tracking-[0.35em] uppercase font-sans text-gold">
            What People Say
          </span>
          <div class="w-8 h-px bg-gold" />
        </div>
        <h2 class="font-display text-display-sm text-ink-light font-light">
          Voices from the <span class="italic text-crimson">Audience</span>
        </h2>
      </div>

      <!-- Testimonial Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <div
          v-for="(item, index) in testimonials"
          :key="item.id"
          :ref="(el) => setCardRef(el as HTMLElement, index)"
          class="group relative flex flex-col bg-bg-dark-surface p-8 md:p-10 hover:bg-bg-dark-elevated transition-colors duration-500 overflow-hidden"
          @mousemove="onMouseMove($event, index)"
          @mouseleave="onMouseLeave(index)"
        >

          <!-- Spotlight overlay -->
          <div
            class="absolute inset-0 pointer-events-none"
            :style="{ ...spotlights[index], transition: 'opacity 0.4s ease' }"
          />

          <!-- Quote mark -->
          <span class="font-display text-7xl text-crimson/40 leading-none mb-4 group-hover:text-crimson/60 transition-colors duration-500 select-none">
            "
          </span>

          <!-- Quote -->
          <p class="font-display text-lg md:text-xl font-light italic text-ink-light/80 leading-relaxed flex-1 mb-8">
            {{ item.quote }}
          </p>

          <!-- Bottom rule -->
          <div class="w-8 h-px bg-crimson/40 mb-6 group-hover:w-16 transition-all duration-500 ease-expo-out" />

          <!-- Author -->
          <div>
            <p class="font-sans text-sm font-light text-ink-light tracking-wide">
              {{ item.author }}
            </p>
            <p class="text-[10px] tracking-[0.2em] uppercase font-sans text-ink-light/35 mt-1">
              {{ item.event }} · {{ item.location }}
            </p>
          </div>

        </div>
      </div>

    </div>
  </section>
</template>
