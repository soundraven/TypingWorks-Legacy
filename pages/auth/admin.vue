<template>
  <div :class="$style.index">
    <div :class="$style.container">
      <ClientOnly>
        <el-table> </el-table>
      </ClientOnly>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { $indexStore } = useNuxtApp()

onMounted(async () => {})
</script>

<style lang="scss" module>
.index {
  min-height: 100dvh;
  display: flex;
  justify-content: center;

  > .container {
    width: 1000px;
    min-height: 600px;

    display: flex;
    justify-content: center;

    background-color: var(--bg-secondary);

    border: 1px solid var(--border-color);
    border-radius: 10px;

    padding: 12px;
    margin-block: auto;
  }
}
</style>
