<script setup lang="ts">
const { score, fail } = $(useStatusStore())

let disable = $ref(false)
let id = $(useCookie('id'))
let name = $(useCookie('name'))

interface rank {
  index: number
  name: string
  score: number
}

let ranks = $ref(
  useFetch<{ data: rank[]; me?: rank }>(config.rankAPI, {
    params: { id },
    credentials: 'omit',
  }).data.value!,
)

onBeforeMount(() => {
  if (ranks.me) {
    for (let i = ranks.me.index - 1; i < ranks.data.length; i++) {
      if (ranks.data[i].index !== ranks.me.index) {
        ranks.data.splice(i, 0, { ...ranks.me, name: `${name} (你自己)` })
        break
      }
    }
  }
})

watch($$(fail), () => (disable = !fail))

async function handleClick() {
  disable = true

  // 自定义ID
  if (name.startsWith(':id')) {
    let tmp
    [, id, ...tmp] = name.split(' ')
    name = tmp.join(' ')
  }

  // 有ID
  if (id) {
    $fetch(config.rankAPI, {
      method: 'post',
      credentials: 'omit',
      body: JSON.stringify({ id, score }),
    })
  }
  // 无ID
  else {
    name = name || '匿名'

    id = await $fetch(config.rankAPI, {
      method: 'post',
      credentials: 'omit',
      body: { name, score },
    })
  }

  ranks = await $fetch(config.rankAPI, {
    params: { id },
    credentials: 'omit',
  })
}
</script>

<template>
  <n-collapse-transition :show="fail && Boolean(ranks)">
    <br>
    <n-space justify="center">
      <n-button
        v-if="Boolean(id)"
        type="error"
        @click="() => {
          name = ''
          id = ''
        }"
      >
        清除
      </n-button>
      <n-input
        v-else
        class="min-w-[100px]"
        :maxlength="30"
        :value="name ? String(name) : ''"
        autosize
        placeholder="用户名: "
        @update:value="
          (value: string) => {
            name = value.trim()
          }
        "
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
      :data="ranks.data"
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
    />
  </n-collapse-transition>
</template>
