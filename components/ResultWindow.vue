<template>
    <div :class="$style.index">
        <div :class="$style.infos">
            <div :class="$style.pageName">Typing.Works.Legacy</div>
            <div></div>
            <div :class="$style.currentTime">2024-05-10 / 12:01:38</div>
            <div :class="$style.typingMode">Typing Mode</div>
            <div :class="$style.typingModeInfo">
                {{ props.typingInfo.count }}
            </div>
            <div :class="$style.wpm">Max/Avg WPM</div>
            <div :class="$style.wpmInfo">
                {{ props.typingInfo.maxWpm }} / {{ props.typingInfo.avgWpm }}
            </div>
            <div :class="$style.cpm">Max/Avg CPM</div>
            <div :class="$style.cpmInfo">
                {{ props.typingInfo.maxCpm }} / {{ props.typingInfo.avgCpm }}
            </div>
            <div :class="$style.accuracy">Accuracy</div>
            <div :class="$style.accuracyInfo">
                {{ props.typingInfo.avgTypingAccuracy }} %
            </div>
            <div :class="$style.progress">Progress</div>
            <div :class="$style.progressInfo">
                {{ props.typingInfo.avgTypingProgress }} %
            </div>
            <div :class="$style.explanation">
                Press Enter or Esc to continue
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useTypedQuote } from "@/store/typedQuote"
import {
    TypoStatus,
    Language,
    Direction,
    type Quote,
    type TypingInfo,
} from "~/structure/quotes"

const $style = useCssModule()
const store = useTypedQuote()

const emits = defineEmits()
const props = defineProps(["typingInfo"])

const typingInfo = props.typingInfo

const closeResult = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "Escape") {
        store.resetList()
        emits("closeResult")
    }
}

onMounted(() => {
    setTimeout(() => {
        window.addEventListener("keyup", closeResult)
    }, 500)
})

onBeforeUnmount(() => {
    window.removeEventListener("keyup", closeResult)
})
</script>

<style module lang="scss">
.index {
    width: 100vw;
    height: 100vh;

    position: fixed;
    top: 0;
    left: 0;

    display: flex;
    justify-content: center;
    align-items: center;

    background-color: rgba(0, 0, 0, 0.5);

    .infos {
        width: 600px;
        height: 800px;

        position: relative;

        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(8, 1fr);
        grid-gap: 20px;

        background-color: var(--bg);
        box-shadow: 0 0 50px var(--color-primary);

        border: 2px solid var(--border-color);
        border-radius: 20px;

        padding: 10px;

        div {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 20px;
            border: 1px solid var(--border-color);
            border-radius: 20px;
            box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2);
        }

        .pageName {
            grid-area: 1 / 1 / 2 / 4;
        }

        .currentTime {
            grid-area: 2 / 1 / 3 / 4;
        }

        .typingMode {
            grid-area: 3 / 1 / 4 / 2;
        }

        .typingModeInfo {
            grid-area: 3 / 2 / 4 / 4;
        }

        .wpm {
            grid-area: 4 / 1 / 5 / 2;
        }

        .wpmInfo {
            grid-area: 4 / 2 / 5 / 4;
        }

        .cpm {
            grid-area: 5 / 1 / 6 / 2;
        }

        .cpmInfo {
            grid-area: 5 / 2 / 6 / 4;
        }

        .accuracy {
            grid-area: 6 / 1 / 7 / 2;
        }

        .accuracyInfo {
            grid-area: 6 / 2 / 7 / 4;
        }

        .progress {
            grid-area: 7 / 1 / 8 / 2;
        }

        .progressInfo {
            grid-area: 7 / 2 / 8 / 4;
        }

        .explanation {
            grid-area: 8 / 1 / 9 / 4;
        }
    }
}
</style>
