<template>
    <div :class="$style.index">
        <div>
            {{ typingInfo.avgWpm }}
        </div>
        <div>
            {{ typingInfo.avgCpm }}
        </div>
        <div>
            {{ typingInfo.maxWpm }}
        </div>
        <div>
            {{ typingInfo.maxCpm }}
        </div>
        <div>
            {{ typingInfo.avgAccuracy }}
        </div>
        <div>
            {{ typingInfo.avgProgress }}
        </div>
        <div>
            {{ typingInfo.count }}
        </div>
        <div>
            {{ typingInfo.entireElapsedtime }}
        </div>
        <button @click="store.resetList">리셋버튼</button>
    </div>
</template>

<script setup lang="ts">
import { useTypedQuote } from "@/store/typedQuote"

const $style = useCssModule()
const store = useTypedQuote()

const typingInfo = store.typingInfo
</script>

<style module lang="scss">
.index {
    background-color: red;
}
</style>
