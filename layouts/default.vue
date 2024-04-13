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
    height: 50px;
    border-bottom: 1px solid red;

    > .header {
        width: 300px;
        height: 50px;
        border: 1px solid blue;
        font-size: 30px;
        margin-inline: auto;
    }
}
</style>
