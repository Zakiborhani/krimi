<script setup lang="ts">
// Dara IT portal chat widget. The script shows the bubble only when the
// assistant is available, so nothing appears if the service is off.
const { portalUrl, chatAssistantId } = useRuntimeConfig().public.daraCms

if (chatAssistantId) {
  useHead({
    script: [{
      key: 'dara-chat',
      src: `${portalUrl}/api/public/widget.js`,
      'data-assistant': chatAssistantId,
      async: true,
      tagPosition: 'bodyClose',
    }],
  })
}
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
