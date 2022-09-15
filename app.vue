<script setup lang="ts">
import { darkTheme, lightTheme } from 'naive-ui'

useHead({
  title: 'Pong Game',
  link: [
    {
      rel: 'icon', type: 'image/png', href: '/nuxt.png',
    },
  ],
})

const color = useColorMode()
const theme = color.value === 'dark' ? darkTheme : lightTheme
</script>

<template>
  <n-config-provider :theme="theme">
    <NuxtPage />
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
