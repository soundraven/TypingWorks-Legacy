<template>
    <!-- <ExampleComponent />
        <p>main index page</p>
        <p>utils index: {{ indexNumberFormat(123456) }}</p>
        <p>utils named: {{ numberFormat(123456) }}</p>
        <p>lodash: {{ $_.join(array, "") }}</p>
        <p>vueuse useMouse: {{ x }}, {{ y }}</p> -->
    <div :class="$style.index">
        <div :class="$style.text">
            <div
                v-for="(text, index) in animatedTitle"
                :key="'text_' + index"
                :class="$style.animatedText"
            >
                {{ text }}
            </div>
        </div>

        <div :class="$style.explain">Press Enter to start!!</div>
        <!-- <div>
            <NuxtLink to="/">랜딩페이지</NuxtLink>
            <NuxtLink to="/typings" style="margin: 20px">타이핑페이지</NuxtLink>
        </div> -->
    </div>
</template>

<script setup lang="ts">
const title: Ref<string> = ref("Typingworks.Legacy")
const splitedTitle: Ref<string[]> = ref([])
const animatedTitle: Ref<string[]> = ref([])

const animatedTitleId: Ref<NodeJS.Timeout | undefined> = ref(undefined)

let characterCount = 0

const animateTitle = () => {
    splitedTitle.value = title.value.split("")
    // splitedTitle.value.reverse()
    animatedTitleId.value = setInterval(addCharacter, 200)
}

// const splitTitle = () => {
//     splitedTitle.value.pop()
// }

const addCharacter = () => {
    if (splitedTitle.value.length > 0) {
        animatedTitle.value.push(splitedTitle.value.shift())
        console.log(animatedTitle.value, splitedTitle.value)
    } else {
        clearInterval(animatedTitleId.value)
        setTimeout(reset, 2000)
    }
}
const reset = () => {
    splitedTitle.value = []
    animatedTitle.value = []
    setTimeout(animateTitle, 1000)
}
onMounted(() => {
    animateTitle()
})
// definePageMeta({
//     middleware: ["auth"],
// })

// const array = ref([1, 2, 3])
// const { x, y } = useMouse()
</script>

<style lang="scss" module>
@keyframes flash-border {
    0% {
        border-right-color: var(--color-secondary);
    }
    50% {
        border-right-color: transparent;
    }
    100% {
        border-right-color: var(--color-secondary);
    }
}

.index {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    position: relative;

    > .text {
        height: 120px;
        display: flex;
        font-size: 90px;
        margin-top: 400px;
        position: relative;
    }

    > .text::after {
        content: "";
        height: 80%;

        border-right: 10px solid var(--color-secondary);

        animation: flash-border 1.2s infinite;

        position: absolute;
        right: -30px;
        top: 50%;
        transform: translateY(-50%);
    }

    > .explain {
        font-size: 40px;
        margin-top: 1200px;

        position: fixed;
    }
}
</style>
