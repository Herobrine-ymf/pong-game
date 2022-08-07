<script setup lang="ts">
interface Props {
  diameter: number;
  offsetX: number;
  offsetY: number;
}
defineProps<Props>();
</script>

<template>
  <div
    class="bullet"
    :style="{
      width: diameter + 'px',
      height: diameter + 'px',
      left: offsetX + 'px',
      top: offsetY + 'px',
    }"
  />
</template>

<style scoped>
.bullet {
  position: absolute;
  background-color: brown;
  border-radius: 50%;
}
</style>
