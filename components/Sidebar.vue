<template>
  <div :class="[$style.index, { [$style.isActive]: isOpen }]">
    <div :class="$style.header">Typing Setting</div>
    <div :class="$style.settingContainer">
      <div :class="$style.menuText">Language</div>
      <div :class="$style.radioGroup">
        <el-radio-group v-model="internalSelectedLanguage" size="large">
          <el-radio-button
            v-for="language in $indexStore.sentenceInfo().languages"
            :key="language.code"
            :label="language.code"
          >
            {{ language.name }}
          </el-radio-button>
        </el-radio-group>
      </div>
      <div :class="$style.menuText">Type of Sentence</div>
      <div :class="$style.radioGroup">
        <el-radio-group v-model="internalSelectedType" size="large">
          <el-radio-button
            v-for="type in $indexStore.sentenceInfo().types"
            :key="type.code"
            :label="type.code"
          >
            {{ type.name }}
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

const props = defineProps({
  selectedLanguage: String,
  selectedType: String,
})

const emit = defineEmits([
  "update:selectedLanguage",
  "update:selectedType",
  "triggerReadySentence",
])

defineExpose({
  openSidebar,
  closeSidebar,
})

const internalSelectedLanguage = ref(props.selectedLanguage)
const internalSelectedType = ref(props.selectedType)

onMounted(async () => {})

const handleLanguageChange = (newLanguage: string | undefined) => {
  internalSelectedLanguage.value = newLanguage
  emit("update:selectedLanguage", newLanguage)
}
const handleTypeChange = (newType: string | undefined) => {
  internalSelectedType.value = newType
  emit("update:selectedType", newType)
}

const triggerReadySentence = () => {
  emit("triggerReadySentence")
}

watch(
  () => internalSelectedLanguage.value,
  (newVal) => {
    handleLanguageChange(newVal), triggerReadySentence()
  },
)

watch(
  () => internalSelectedType.value,
  (newVal) => {
    handleTypeChange(newVal), triggerReadySentence()
  },
)
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
