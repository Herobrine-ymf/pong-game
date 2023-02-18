<script setup lang="ts">
defineProps<{
  diameter: number
  offsetX: number
  offsetY: number
}>()
</script>

<template>
  <div
    class="absolute bg-amber-500 rd-full" :style="{
      width: `${diameter}px`,
      height: `${diameter}px`,
      left: `${offsetX}px`,
      top: `${offsetY}px`,
    }"
  />
</template>
