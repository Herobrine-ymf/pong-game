<script setup lang="ts">
interface Props {
  fail: boolean;
  displayPoint: number;
}
const props = defineProps<Props>();

let rank = $ref([{ name: "正在加载...", point: 0 }]);

let clickable = $ref(true);
watch(
  () => props.fail,
  (newValue) => {
    if (newValue) {
      clickable = true;
    }
  }
);

const name = $ref("");
const gsetRank = (set = true) => {
  if (set) {
    const _tmp = { name: name ? name : "匿名", point: props.displayPoint };
    axios.get("/.netlify/functions/rank", {
      params: _tmp,
    });
    rank.push(_tmp);
    clickable = false;
  } else {
    axios.get("/.netlify/functions/rank").then((res) => {
      rank = res.data;
    });
  }
};
gsetRank(false);
</script>

<template>
  <div v-if="fail">
    <el-input v-model="name" placeholder="用户名: " />
    <el-button
      type="primary"
      @click="gsetRank()"
      :disabled="!(clickable && displayPoint >= 20)"
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
