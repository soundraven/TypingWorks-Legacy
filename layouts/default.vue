<template>
    <div :class="$style.index" v-if="route.path !== '/'">
        <div :class="$style.header" @click="navigateTo('/')">
            Typingworks.Legacy
        </div>
    </div>
    <slot />
</template>

<script setup>
const route = useRoute()
</script>

<style lang="scss" module>
.index {
    width: 100%;
    height: 60px;
    border-bottom: 3px solid var(--color-primary);

    > .header {
        width: 300px;
        height: 100%;

        font-size: 25px;
        text-align: center;
        line-height: 60px;

        margin-inline: auto;

        cursor: pointer;
    }
}
</style>
