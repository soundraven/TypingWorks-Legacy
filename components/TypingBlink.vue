<template>
    <div
        v-for="(row, rowIndex) in keyArray"
        :key="'row_' + rowIndex"
        :class="$style['R' + (keyArray.length - 1 - rowIndex)]"
    >
        <div
            v-for="(key, keyIndex) in row"
            :key="'key_' + keyIndex"
            :class="[
                getPressedKeyClass(key),
                $style.key,
                { [$style.blink]: pressedKey === key },
            ]"
        ></div>
    </div>
</template>

<script setup lang="ts">
import keyArray from "~/utils/keyArray"
const $style = useCssModule()

//dictionary
const pressedKey: Ref<string> = ref("")

onMounted(() => {
    if (process.server) return
    window.addEventListener("keydown", handleKeyDown) //누를시 반짝임
    window.addEventListener("keyup", handleKeyUp) //뗄시 없어짐
})

onBeforeUnmount(() => {
    window.removeEventListener("keydown", handleKeyDown)
    window.removeEventListener("keyup", handleKeyUp)
})

const handleKeyDown = (e: KeyboardEvent) => {
    pressedKey.value = e.code
}

const handleKeyUp = (e: KeyboardEvent) => {
    pressedKey.value = ""
}

const getPressedKeyClass = (key: string): string => {
    return `${$style[key] || ""}`
}
</script>

<style lang="scss" module>
@keyframes flash-box-shadow {
    0% {
        box-shadow:
            inset 0px 0px 35px var(--color-primary-shadow-inset-start),
            0px 0px 35px var(--color-primary-shadow-start);
    }
    25% {
        box-shadow:
            inset 0px 0px 30px var(--color-primary-shadow-inset-start),
            0px 0px 30px var(--color-primary-shadow-start);
    }
    50% {
        box-shadow:
            inset 0px 0px 25px var(--color-primary-shadow-inset-mid),
            0px 0px 25px var(--color-primary-shadow-mid);
    }
    75% {
        box-shadow:
            inset 0px 0px 30px var(--color-primary-shadow-inset-mid),
            0px 0px 30px var(--color-primary-shadow-mid);
    }
    100% {
        box-shadow:
            inset 0px 0px 35px var(--color-primary-shadow-inset-start),
            0px 0px 35px var(--color-primary-shadow-inset-start);
    }
}

$u: 18px;

.R0,
.R1,
.R2,
.R3,
.R4 {
    width: 92%;
    height: 92%;

    display: flex;
    justify-content: center;

    > div {
        width: $u;
        height: $u;

        background-color: var(--alpah-row);

        border: 1px solid var(--border-color);
        border-radius: 5px;

        margin: auto;
    }

    > .Escape {
        background-color: var(--accent-esc);
    }

    > .ControlLeft,
    .MetaLeft,
    .MetaRight,
    .AltLeft,
    .AltRight,
    .Fn,
    .ControlRight {
        width: $u * 1.25;
        background-color: var(--modi-row);
    }

    > .Tab,
    .Backslash {
        width: $u * 1.5;
        background-color: var(--modi-row);
    }

    > .Backslash {
        background-color: var(--alpah-row);
    }

    > .CapsLock {
        width: $u * 1.75;
        background-color: var(--modi-row);
    }

    > .Backspace {
        width: $u * 2;
        background-color: var(--modi-row);
    }

    > .ShiftLeft,
    .Enter {
        width: $u * 2.25;
        background-color: var(--modi-row);
    }

    > .Enter {
        background-color: var(--accent-enter);
    }

    > .ShiftRight {
        width: $u * 2.75;
        background-color: var(--modi-row);
    }

    > .Space {
        width: $u * 6.25;
        background-color: var(--alpah-row);
    }

    > .key {
        transition-timing-function: ease-out;
        transition-duration: 0.7s;

        &.blink {
            background-color: var(--color-primary);
            transition-duration: 0s;
            box-shadow: 0px 0px 20px var(--color-primary);
            opacity: 0.8;
        }
    }
}
</style>
