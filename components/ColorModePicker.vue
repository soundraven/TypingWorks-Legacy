<template>
    <div :class="$style.index">
        <IconLight
            @click="$colorMode.preference = ThemeColor.Light"
            :class="getActiveClass(ThemeColor.Light)"
        />
        <IconDark
            @click="$colorMode.preference = ThemeColor.Dark"
            :class="getActiveClass(ThemeColor.Dark)"
        />
        <IconSepia
            @click="$colorMode.preference = ThemeColor.Sepia"
            :class="getActiveClass(ThemeColor.Sepia)"
        />
        <IconSystem
            @click="$colorMode.preference = ThemeColor.System"
            :class="getActiveClass(ThemeColor.System)"
        />
    </div>
</template>

<script setup lang="ts">
const $style = useCssModule()
const colorMode = useColorMode()
import { ThemeColor } from "~/structure/theme"

const getActiveClass = (color: string): string => {
    if (colorMode.preference == color) return "selected"
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
}
</style>
