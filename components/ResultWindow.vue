<template>
    <div :class="$style.index">
        <div>
            {{ store.typingInfo.avgWpm }}
        </div>
        <div>
            {{ store.typingInfo.avgCpm }}
        </div>
        <div>
            {{ store.typingInfo.maxWpm }}
        </div>
        <div>
            {{ store.typingInfo.maxCpm }}
        </div>
        <div>
            {{ store.typingInfo.avgTypingAccuracy }}
        </div>
        <div>
            {{ store.typingInfo.avgTypingProgress }}
        </div>
        <div>
            {{ store.typingInfo.count }}
        </div>
        <div>
            {{ store.typingInfo.entireElapsedtime }}
        </div>
        <button @click="store.resetList">리셋버튼</button>
    </div>
</template>

<script setup lang="ts">
import { useTypedQuote } from "@/store/typedQuote"

const $style = useCssModule()
const store = useTypedQuote()
</script>

<style module lang="scss">
.index {
    background-color: red;
}
</style>
