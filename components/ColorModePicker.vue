<template>
    <div :class="$style.index">
        <IconLight
            @click="$colorMode.preference = ThemeColor.Light"
            :class="[getActiveClass(ThemeColor.Light), $style.icon]"
        />
        <IconDark
            @click="$colorMode.preference = ThemeColor.Dark"
            :class="[getActiveClass(ThemeColor.Dark), $style.icon]"
        />
        <IconSepia
            @click="$colorMode.preference = ThemeColor.Sepia"
            :class="[getActiveClass(ThemeColor.Sepia), $style.icon]"
        />
        <IconSystem
            @click="$colorMode.preference = ThemeColor.System"
            :class="[getActiveClass(ThemeColor.System), $style.icon]"
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

<!-- <template>
    <div :class="$style.index">
        <component
            v-for="themeColor in themeColors"
            :key="themeColor"
            :is="`Icon${themeColor}`"
            @click="$colorMode.preference = themeColor.toLowerCase()"
            :class="[
                getActiveClass(themeColor.toLowerCase()),
                $style.themeColor,
            ]"
        />
    </div>
</template>

<script setup lang="ts">
import { ThemeColor } from "~/structure/theme"
import IconLight from "#components"

const $style = useCssModule()
const colorMode = useColorMode()

// const themeColors = [
//     ThemeColor.Light,
//     ThemeColor.Dark,
//     ThemeColor.Sepia,
//     ThemeColor.System,
// ]

const themeColors = ["Light", "Dark", "Sepia", "System"]
const getActiveClass = (color: string): string => {
    return colorMode.preference === color ? "selected" : ""
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
        width: 40px;
    }
}
</style> -->
