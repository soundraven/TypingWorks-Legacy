<template>
  <div :class="[$style.index, { [$style.isActive]: isOpen }]">
    <div :class="$style.header">Typing Setting</div>
    <div :class="$style.settingContainer">
      <div :class="$style.menuText">Language</div>
      <div :class="$style.radioGroup">
        <el-radio-group v-model="selectLanguage" size="large">
          <el-radio-button
            v-for="languageName in LanguageNameGroup"
            :key="languageName"
            :label="languageName"
          >
            {{ languageName }}
          </el-radio-button>
        </el-radio-group>
      </div>
      <div :class="$style.menuText">Type of Sentence</div>
      <div :class="$style.radioGroup">
        <el-radio-group v-model="selectLanguage" size="large">
          <el-radio-button
            v-for="languageName in LanguageNameGroup"
            :key="languageName"
            :label="languageName"
          >
            {{ languageName }}
          </el-radio-button>
        </el-radio-group>
      </div>
    </div>
  </div>
  <div v-if="isOpen" :class="$style.overlay" @click="closeSidebar"></div>
</template>

<script setup lang="ts">
const { $indexStore } = useNuxtApp()

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

const selectLanguage: Ref<string> = ref("Korean")
const LanguageNameGroup: Ref<string[]> = ref([])

onMounted(async () => {
  $indexStore.language().getLanguages()
  LanguageNameGroup.value = $indexStore.language().languageNames
})
</script>

<style lang="scss" module>
.index {
  width: 300px;
  height: 100%;

  background-color: var(--bg-secondary);

  position: fixed;
  top: 0;
  right: 0;
  z-index: 10;

  transform: translateX(100%);
  transition: transform 0.3s ease-in-out;

  > .header {
    width: 100%;
    height: 60px;

    font-size: 24px;
    text-align: center;
    line-height: 60px;

    margin-inline: auto;
    border-bottom: 3px solid var(--color-primary);
  }

  > .settingContainer {
    padding: 12px;

    > .menuText {
      height: 20px;

      font-size: 20px;
      text-align: center;
      line-height: 20px;

      margin-bottom: 24px;
    }

    > .radioGroup {
      width: 100%;
      display: flex;
      justify-content: center;
      margin-bottom: 24px;
    }
  }
}

.isActive {
  transform: translateX(0);
}

.overlay {
  width: 100%;
  height: 100%;

  background-color: rgba(0, 0, 0, 0.5);

  position: fixed;
  top: 0;
  left: 0;
  z-index: 5;
}
</style>
