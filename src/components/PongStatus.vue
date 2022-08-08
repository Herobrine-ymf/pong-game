<script setup lang="ts">
interface Props {
  start: () => void;
  fail: boolean;
  displayPoint: number;
}
defineProps<Props>();

const emit = defineEmits(["difficulty"]);

const difficulty = $ref(config.difficulty);
emit("difficulty", difficulty);
</script>

<template>
  <el-input-number v-model="difficulty" :min="1" :max="30" />
  <div @click.stop="start">
    <div v-if="fail">
      <el-button type="danger" style="font-size: 12px">
        <h1>Game Over</h1>
      </el-button>
    </div>
    <el-tag type="success" size="large">
      <h2>{{ displayPoint }} 分</h2>
    </el-tag>
  </div>
</template>
