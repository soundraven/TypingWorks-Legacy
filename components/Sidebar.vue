<template>
  <div :class="[$style.sidebar, { [$style.isActive]: isOpen }]">
    사이드바 입니다.
  </div>
  <div v-if="isOpen" :class="$style.overlay" @click="closeSidebar"></div>
</template>

<script setup lang="ts">
const isOpen: Ref<boolean> = ref(false)

const openSidebar = () => {
  isOpen.value = true
}

const closeSidebar = () => {
  isOpen.value = false
}

defineExpose({
  openSidebar,
  closeSidebar,
})
</script>

<style lang="scss" module>
.sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100%;
  transform: translateX(100%);
  transition: transform 0.3s ease-in-out;
  z-index: 10;
  background-color: #fff; /* 사이드바 배경색 추가 */
}

/* 사이드바가 활성화될 때 화면에 보이도록 변경 */
.isActive {
  transform: translateX(0);
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 5;
}
</style>
