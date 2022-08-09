<script setup lang="ts">
interface Props {
  fail: boolean;
  point: number;
}
const { fail, point } = defineProps<Props>();

let disable = $ref(false);
watch(
  () => fail,
  () => (disable = !fail)
);

const rank = $ref(
    (await axios.post(config.url, { headers: config.headers })).data
  ),
  sortedRank = $computed(() =>
    rank.sort(
      ({ point: a }: { point: number }, { point: b }: { point: number }) =>
        b - a
    )
  ),
  name = $ref("");

const insert = async () => {
  disable = true;

  const data = { name: name || "匿名", point: point };
  rank.push(data);
  axios.post(config.url, data, { headers: config.headers });
};
</script>

<template>
  <div v-if="fail">
    <el-input v-model="name" placeholder="用户名: " />
    <el-button
      type="primary"
      @click="insert()"
      :disabled="disable || !(point >= 20)"
    >
      提交
    </el-button>

    <el-table :data="sortedRank" table-layout="auto">
      <el-table-column type="index" />
      <el-table-column prop="name" label="用户名" />
      <el-table-column prop="point" label="分数" />
    </el-table>
  </div>
</template>
