<template>
    <div :class="$style.index">
        <div :class="$style.infos">
            <div :class="$style.pageName">Typingworks.Legacy</div>
            <div></div>
            <div :class="$style.currentTime">{{ formattedTime }}</div>
            <div :class="$style.typingMode">Typing Mode</div>
            <div :class="$style.typingModeInfo">
                Lang: {{ props.typingInfo.targetLanguage }}, Type:
                {{ props.typingInfo.quoteType }}, Goal:
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
                Press&nbsp;<span>Enter</span>&nbsp;or&nbsp;<span>Esc</span>&nbsp;to
                continue
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useTypedQuote } from "@/store/typedQuote"

const $style = useCssModule()
const store = useTypedQuote()

const emits = defineEmits()
const props = defineProps(["typingInfo"])
console.log(props.typingInfo)

const closeResult = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "Escape") {
        store.resetList()
        emits("closeResult")
    }
}

const currentTime = new Date()
const formattedTime = currentTime.toLocaleString()

onMounted(() => {
    setTimeout(() => {
        window.addEventListener("keydown", closeResult)
    }, 500)
})

onBeforeUnmount(() => {
    window.removeEventListener("keydown", closeResult)
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

    > .infos {
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

        > div {
            display: flex;
            justify-content: center;
            align-items: center;

            font-size: 20px;

            border: 1px solid var(--border-color);
            border-radius: 20px;
            box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.15);

            > span {
                color: var(--color-primary);
            }
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
