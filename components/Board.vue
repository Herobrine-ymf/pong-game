<script setup lang="ts">
defineProps<{
  width: number
  height: number
  top?: number
  bottom?: number
  left?: number
  right?: number
}>()
</script>

<template>
  <div
    class="absolute bg-orange-600 rd-2" :style="{
      width: `${width}px`,
      height: `${height}px`,
      top: `${top}px`,
      bottom: `${bottom}px`,
      left: `${left}px`,
      right: `${right}px`,
    }"
  />
</template>
