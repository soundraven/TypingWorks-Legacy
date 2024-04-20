<template>
    <div :class="$style.index">
        <IconLight
            @click="$colorMode.preference = 'light'"
            :class="getActiveClass('light')"
        />
        <IconDark @click="$colorMode.preference = 'dark'" />
        <IconSepia @click="$colorMode.preference = 'sepia'" />
        <IconSystem @click="$colorMode.preference = 'system'" />
    </div>
</template>

<script setup lang="ts">
const $style = useCssModule()
const colorMode = useColorMode()

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
