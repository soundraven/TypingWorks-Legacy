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

    .icon {
        //어째서인지 언어 변경시 그림자 사라지는 현상 발생
        box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2);
    }
}
</style>
