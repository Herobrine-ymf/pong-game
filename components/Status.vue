<script setup lang="ts">
defineEmits(['click'])

const { difficulty, score, fail } = $(useStatusStore())
</script>

<template>
  <n-space align="center" vertical>
    <n-tag :bordered="false" type="success" size="large">
      <h2>{{ score }} 分</h2>
    </n-tag>
    <n-collapse-transition :show="fail">
      <n-space align="center" vertical>
        <n-button type="error" @click.stop="$emit('click')">
          <h1>Game Over</h1>
        </n-button>
        <n-input-number
          v-model:value="difficulty" class="w-[250px]" size="large" :min="2" :max="10"
          button-placement="both"
        />
      </n-space>
    </n-collapse-transition>
  </n-space>
</template>
