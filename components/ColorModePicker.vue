<template>
    <div :class="$style.index">
        <IconLight @click="$colorMode.preference = 'light'" />
        <IconDark @click="$colorMode.preference = 'dark'" />
        <IconSepia @click="$colorMode.preference = 'sepia'" />
        <IconSystem @click="$colorMode.preference = 'system'" />
    </div>
</template>

<script setup lang="ts">
const $style = useCssModule()
const colorMode = useColorMode()
</script>

<style lang="scss" module>
.index {
    display: flex;
}
</style>
