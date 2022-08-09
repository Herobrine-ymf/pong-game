<script setup lang="ts">
interface Props {
  fail: boolean;
  point: number;
}
const props = defineProps<Props>();

let disable = $ref(false);
watch(
  () => props.fail,
  () => {
    if (props.fail) {
      disable = false;
    }
  }
);

let rank = $ref([{ name: "正在加载...", point: 0 }]);
const url = "/.netlify/functions/rank";
const name = $ref("");

axios.post(url, { headers: config.headers }).then(({ data }) => {
  rank = data;
});

const setRank = () => {
  const data = { name: name ? name : "匿名", point: props.point };
  axios.post(url, data, { headers: config.headers });
  rank.push(data);

  disable = true;
};
</script>

<template>
  <div v-if="fail">
    <el-input v-model="name" placeholder="用户名: " />
    <el-button
      type="primary"
      @click="setRank()"
      :disabled="disable || !(point >= 20)"
    >
      提交
    </el-button>

    <el-table
      :data="
        rank
          .sort((a, b) => {
            return b['point'] - a['point'];
          })
          .slice(0, 10)
      "
      table-layout="auto"
    >
      <el-table-column type="index" />
      <el-table-column prop="name" label="用户名" />
      <el-table-column prop="point" label="分数" />
    </el-table>
  </div>
</template>
