<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'

const { y } = useWindowScroll()
const isScrolled = computed(() => y.value > 60)
const isMenuOpen = ref(false)

const navLinks = [
  { label: 'Events', to: '/#events' },
  { label: 'Artists', to: '/artists' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

const isBtnHovered = ref(false)

const ctaBtnStyle = computed(() => {
  if (isBtnHovered.value) {
    return { backgroundColor: '#003136', color: '#FEF2E8', borderColor: '#003136' }
  }
  return { backgroundColor: '#002429', color: '#FEF2E8', borderColor: '#002429' }
})

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

watch(isMenuOpen, (open) => {
  if (process.client) {
    document.body.style.overflow = open ? 'hidden' : ''
  }
})
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-bg/90 backdrop-blur-md border-b border-ink/10">
    <div class="max-w-site mx-auto px-6 md:px-10 lg:px-16">
      <nav class="flex items-center justify-between py-4 md:py-5">

        <!-- Logo -->
        <NuxtLink
          to="/"
          class="flex items-center leading-none group"
          aria-label="Karimi Entertainment — home"
          @click="closeMenu"
        >
          <img
            src="/images/karimi-logo-white.png"
            alt="Karimi Entertainment"
            class="navbar-logo h-9 md:h-11 w-auto select-none transition-opacity duration-300 ease-power2-out group-hover:opacity-80"
            width="1007"
            height="537"
          >
        </NuxtLink>

        <!-- Desktop Nav -->
        <ul class="hidden md:flex items-center gap-8 lg:gap-10">
          <li v-for="link in navLinks" :key="link.label">
            <a
              :href="link.to"
              :class="['nav-link text-[11px] tracking-[0.2em] uppercase font-sans font-light transition-colors duration-300 ease-power2-out', 'nav-link--light text-ink/85 hover:text-ink']"
            >
              {{ link.label }}
            </a>
          </li>
        </ul>

        <!-- Desktop CTA -->
        <div class="hidden md:flex items-center">
          <a
            href="/#events"
            :style="ctaBtnStyle"
            class="cta-btn"
            @mouseenter="isBtnHovered = true"
            @mouseleave="isBtnHovered = false"
          >
            Get Tickets
          </a>
        </div>

        <!-- Mobile Hamburger -->
        <button
          class="md:hidden flex flex-col justify-center items-end gap-1.5 w-8 h-8 focus:outline-none"
          :aria-label="isMenuOpen ? 'Close menu' : 'Open menu'"
          @click="toggleMenu"
        >
          <span
            :class="[
              'block h-px transition-all duration-400 ease-expo-out',
              'bg-ink',
              isMenuOpen ? 'w-6 rotate-45 translate-y-[10px]' : 'w-6'
            ]"
          />
          <span
            :class="[
              'block h-px transition-all duration-400 ease-expo-out',
              'bg-ink',
              isMenuOpen ? 'opacity-0 w-4' : 'w-4'
            ]"
          />
          <span
            :class="[
              'block h-px transition-all duration-400 ease-expo-out',
              'bg-ink',
              isMenuOpen ? 'w-6 -rotate-45 -translate-y-[10px]' : 'w-6'
            ]"
          />
        </button>

      </nav>
    </div>

  </header>

  <!-- Mobile Menu Overlay — teleported to body to escape backdrop-filter stacking context -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-500 ease-expo-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-400 ease-power2-out"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isMenuOpen"
        class="md:hidden fixed inset-0 z-[45] bg-bg-dark flex flex-col justify-center px-10"
      >
        <!-- Mobile Links -->
        <ul class="flex flex-col gap-6 mb-12">
          <li
            v-for="(link, i) in navLinks"
            :key="link.label"
            :style="{ transitionDelay: `${i * 60}ms` }"
            :class="[
              'transition-all duration-500 ease-expo-out',
              isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            ]"
          >
            <a
              :href="link.to"
              class="font-display text-5xl font-light text-ink-light hover:text-gold transition-colors duration-300"
              @click="closeMenu"
            >
              {{ link.label }}
            </a>
          </li>
        </ul>

        <!-- Mobile CTA -->
        <a
          href="/#events"
          class="inline-flex self-start text-[11px] tracking-[0.2em] uppercase font-sans font-light px-6 py-3 bg-gold text-bg-dark hover:bg-gold-light transition-all duration-300"
          @click="closeMenu"
        >
          Get Tickets
        </a>

        <!-- Mobile Footer Label -->
        <p class="absolute bottom-8 left-10 text-[10px] tracking-[0.25em] uppercase text-ink-light/20 font-sans">
          Karimi Entertainment
        </p>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.navbar-logo {
  filter: invert(1);
}

.nav-link {
  position: relative;
  padding: 5px 10px;
  transition: color 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.nav-link::before,
.nav-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
}

/* Default — instant retract on mouse leave */
.nav-link::before {
  top: 0;
  left: 0;
  border-top: 1px solid currentColor;
  border-right: 1px solid currentColor;
  transition: width 0.1s ease, height 0.1s ease;
}

.nav-link::after {
  bottom: 0;
  right: 0;
  border-bottom: 1px solid currentColor;
  border-left: 1px solid currentColor;
  transition: width 0.1s ease, height 0.1s ease;
}

/* Green snake on light background */
.nav-link--light::before {
  border-color: #00FF90;
}
.nav-link--light::after {
  border-color: #00FF90;
}

/* White snake on dark background */
.nav-link--dark::before {
  border-color: rgba(255, 255, 255, 0.8);
}
.nav-link--dark::after {
  border-color: rgba(255, 255, 255, 0.8);
}

/* Hover — slow snake draws clockwise */
.nav-link:hover::before {
  width: 100%;
  height: 100%;
  transition: width 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s,
              height 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.35s;
}

.nav-link:hover::after {
  width: 100%;
  height: 100%;
  transition: width 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.7s,
              height 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.05s;
}

.cta-btn {
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-family: var(--font-sans);
  font-weight: 300;
  padding: 10px 20px;
  border-width: 1px;
  border-style: solid;
  cursor: pointer;
  transition: background-color 0.45s cubic-bezier(0.16, 1, 0.3, 1),
              color 0.45s cubic-bezier(0.16, 1, 0.3, 1),
              border-color 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
