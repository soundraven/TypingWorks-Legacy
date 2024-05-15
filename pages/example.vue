<template>
    <div class="text">
        <span :class="getTypoClass(0)">Shake me!</span>
    </div>
</template>

<script setup>
import { ref } from "vue"

// 테스트를 위한 TypoStatus 정의
const TypoStatus = {
    NotInput: 0,
    Error: 1,
    Correct: 2,
}

// 상태 초기화
const typoStatus = ref({ value: [TypoStatus.Error] })

// 클래스 부여 함수
const getTypoClass = (index) => {
    if (typoStatus.value[index] === TypoStatus.NotInput) return ""
    if (typoStatus.value[index] === TypoStatus.Error) return "typo"
    if (typoStatus.value[index] === TypoStatus.Correct) return "success"
    return ""
}
</script>

<style scoped>
@keyframes shake {
    0% {
        transform: translateY(0);
    }
    25% {
        transform: translateY(-5px);
    }
    75% {
        transform: translateY(5px);
    }
    100% {
        transform: translateY(0);
    }
}

.typo {
    color: rgba(255, 0, 0, 0.8);
    position: relative;
    animation: shake 1s ease-in-out infinite;
}

.success {
    color: var(--color-primary);
}
</style>
