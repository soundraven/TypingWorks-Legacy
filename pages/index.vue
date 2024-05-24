<template>
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
        <div :class="$style.explain" @click="navigateTo('/typings')">
            Press <span :class="$style.enter">Enter</span> to start or Click
            this letters
        </div>
    </div>
</template>

<script setup lang="ts">
const router = useRouter()

const title: Ref<string> = ref("Typingworks.Legacy")
const splitedTitle: Ref<string[]> = ref([])
const animatedTitle: Ref<string[]> = ref([])
const animatedTitleId: Ref<NodeJS.Timeout | undefined> = ref(undefined)

const animateTitle = () => {
    splitedTitle.value = title.value.split("")
    animatedTitleId.value = setInterval(addCharacter, 200)
}

const addCharacter = () => {
    if (splitedTitle.value.length > 0) {
        const char = splitedTitle.value.shift()

        if (char !== undefined) {
            animatedTitle.value.push(char)
        }
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

const startTyping = (e) => {
    if (e.key === "Enter") {
        navigateTo("/typings")
    }
}

onMounted(() => {
    animateTitle()
    window.addEventListener("keydown", startTyping)
})

onBeforeUnmount(() => {
    window.removeEventListener("keydown", startTyping)
})
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

@keyframes flash-text {
    0% {
        opacity: 1;
    }

    50% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

.index {
    width: 100vw;
    height: 100vh;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    position: relative;

    > .text {
        height: 120px;

        display: flex;

        font-size: 90px;

        // margin-top: 400px;

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
        margin-top: 150px;
        animation: flash-text 2s infinite;
        cursor: pointer;

        > .enter {
            color: var(--color-primary);
        }
    }
}
</style>
