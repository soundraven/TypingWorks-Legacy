<template>
    <div :class="{ 'flash-effect': isFlashing }">내 Div</div>
</template>

<script setup>
import { ref, onMounted } from "vue"

const isFlashing = ref(false)

const $style = useCssModule()

onMounted(() => {
    isFlashing.value = true
    setTimeout(() => {
        isFlashing.value = false
    }, 1000) // 1초 후에 플래시 효과를 종료합니다.
})
</script>

<style>
.flash-effect {
    animation: flash 1s ease-out;
}

@keyframes flash {
    0% {
        opacity: 0.8;
        box-shadow: 0 0 20px 10px var(--color-primary);
    }

    50% {
        opacity: 0.4;
        box-shadow: 0 0 20px 10px rgba(0, 0, 0, 0.8);
    }
    100% {
        opacity: 0;
        box-shadow: none;
    }
}
</style>
