<template>
    <div>예제</div>
    <IconLight @click="$colorMode.preference = 'light'" />
    <IconDark @click="$colorMode.preference = 'dark'" />

    <IconSepia @click="$colorMode.preference = 'sepia'" />
    <IconSystem @click="$colorMode.preference = 'system'" />
</template>

<script setup>
const colorMode = useColorMode()
</script>

<style></style>
