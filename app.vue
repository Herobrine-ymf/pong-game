<script setup lang="ts">
useHead({
  title: 'Pong Game',
  link: [
    {
      rel: 'icon', type: 'image/png', href: '/nuxt.png',
    },
  ],
})

const theme = darkTheme
</script>

<template>
  <n-config-provider :theme="theme">
    <n-message-provider>
      <NuxtPage />
    </n-message-provider>
  </n-config-provider>
</template>

<style>
html, body , #__nuxt{
  height: 100vh;
  margin: 0;
  padding: 0;
}

html.dark {
  background: #222;
  color: white;
}
</style>
