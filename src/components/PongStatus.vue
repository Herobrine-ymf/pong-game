<script setup lang="ts">
interface Props {
  start: () => void;
  fail: boolean;
  point: number;
}
defineProps<Props>();

const difficulty = $ref(config.difficulty);

const emit = defineEmits(["difficulty"]);
watch(difficulty, () => {
  emit("difficulty", difficulty);
});
</script>

<template>
  <el-input-number v-model="difficulty" :min="1" :max="30" />
  <div @click.stop="start">
    <el-button v-if="fail" type="danger" style="font-size: 12px">
      <h1>Game Over</h1>
    </el-button>
    <div />
    <el-tag type="success" size="large">
      <h2>{{ point }} 分</h2>
    </el-tag>
  </div>
</template>
