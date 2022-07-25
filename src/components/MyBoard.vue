<script setup lang="ts">
interface Props {
  width: number;
  height: number;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}
defineProps<Props>();
</script>

<template>
  <div
    class="board"
    :style="{
      width: width + 'px',
      height: height + 'px',
      top: top + 'px',
      bottom: bottom + 'px',
      left: left + 'px',
      right: right + 'px',
    }"
  />
</template>

<style scoped>
.board {
  position: absolute;
  border-radius: 10px;
  background-color: orangered;
}
</style>
