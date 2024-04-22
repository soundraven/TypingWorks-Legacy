<template>
    <div :class="$style.index">
        <div :class="$style.header" @click="navigateTo('/')">
            TypingWorks Legacy
        </div>
    </div>
    <slot />
</template>

<script setup></script>

<style lang="scss" module>
.index {
    width: 100%;
    height: 60px;
    border-bottom: 3px solid var(--color-primary);

    > .header {
        width: 300px;
        height: 100%;
        font-size: 25px;
        line-height: 60px;
        margin-inline: auto;
    }
}
</style>
