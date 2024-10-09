<template>
  <div :class="$style.index">
    <IconLight
      @click="getPreference(ThemeColor.Light)"
      :class="[getActiveClass(ThemeColor.Light), $style.icon]"
    />
    <IconDark
      @click="getPreference(ThemeColor.Dark)"
      :class="[getActiveClass(ThemeColor.Dark), $style.icon]"
    />
    <IconSepia
      @click="getPreference(ThemeColor.Sepia)"
      :class="[getActiveClass(ThemeColor.Sepia), $style.icon]"
    />
    <IconSystem
      @click="getPreference(ThemeColor.System)"
      :class="[getActiveClass(ThemeColor.System), $style.icon]"
    />
  </div>
</template>

<script setup lang="ts">
const $style = useCssModule()
const colorMode = useColorMode()
import { ThemeColor } from "~/types/theme"

const getPreference = (color: ThemeColor) => {
  colorMode.preference = color
}

const getActiveClass = (color: ThemeColor): string => {
  if (colorMode.preference === color) {
    console.log(color)
    return "selected"
  }
  return ""
}
</script>

<style lang="scss" module>
.index {
  width: 100%;
  height: 100%;

  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;

  .icon {
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2);
  }
}
</style>
