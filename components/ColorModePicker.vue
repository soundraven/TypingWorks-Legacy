<template>
    <IconLight @click="$colorMode.preference = 'light'" />
    <IconDark @click="$colorMode.preference = 'dark'" />
    <IconSepia @click="$colorMode.preference = 'sepia'" />
    <IconSystem @click="$colorMode.preference = 'system'" />
    <component :is="" />
</template>

<script setup lang="ts"></script>

<style lang="scss" module></style>
