<script setup lang="ts">
const { score, fail } = $(useStatusStore())
let disable = $ref(false)
let id = $(useCookie('id'))
let name = $(useCookie('name'))
let ranks = $ref(
  useFetch<{ name: string; score: number }[]>(config.rankAPI, {
    credentials: 'omit',
  }).data.value!,
)

watch($$(fail), () => (disable = !fail))

async function handleClick() {
  disable = true
  name = (name || '匿名').trim()

  if (name!.startsWith(':id')) {
    let tmp
    [, id, ...tmp] = name!.split(' ')
    name = tmp.join(' ')
  }

  if (id) {
    $fetch(config.rankAPI, {
      method: 'post',
      credentials: 'omit',
      body: { id, score },
    })
  }
  else {
    id = await $fetch(config.rankAPI, {
      method: 'post',
      credentials: 'omit',
      body: { name, score },
    })
  }

  ranks = await $fetch(config.rankAPI, {
    credentials: 'omit',
  })
}
</script>

<template>
  <n-collapse-transition :show="fail && Boolean(ranks)">
    <br>
    <n-space justify="center">
      <n-button
        v-show="Boolean(id)"
        type="error"
        @click="() => {
          name = ''
          id = ''
        }"
      >
        清除
      </n-button>
      <n-input
        v-model:value="name"
        class="min-w-[100px]"
        autosize
        placeholder="用户名: "
        :disabled="Boolean(id)"
        :maxlength="30"
      />
      <n-button
        :disabled="disable || score < config.scoreLowLimit"
        @click="handleClick()"
      >
        提交
      </n-button>
    </n-space>
    <br>

    <n-data-table
      :data="ranks.map((item, index) => ({ index: index + 1, ...item }))"
      :columns="[
        {
          key: 'index',
          align: 'center',
          width: '50',
        }, {
          title: '用户名',
          key: 'name',
        }, {
          title: '分数',
          key: 'score',
        },
      ]"
      :pagination="{}"
    />
  </n-collapse-transition>
</template>
