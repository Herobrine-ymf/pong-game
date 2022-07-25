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
    class="ball"
    :style="{
      width: diameter + 'px',
      height: diameter + 'px',
      left: offsetX + 'px',
      top: offsetY + 'px',
    }"
  />
</template>

<style scoped>
.ball {
  position: absolute;
  background-color: orange;
  border-radius: 50%;
}
</style>
