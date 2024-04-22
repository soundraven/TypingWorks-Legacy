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
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
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

        background-color: white;

        border: 1px solid rgb(58, 58, 60, 0.09);
        border-radius: 5px;
        box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.15);

        margin: auto;
    }

    > .Escape {
        background-color: pink;
    }

    > .ControlLeft,
    .MetaLeft,
    .MetaRight,
    .AltLeft,
    .AltRight,
    .Fn,
    .ControlRight {
        width: $u * 1.25;
        background-color: #e1e1e1;
    }

    > .Tab,
    .Backslash {
        width: $u * 1.5;
        background-color: #e1e1e1;
    }

    > .Backslash {
        background-color: white;
    }

    > .CapsLock {
        width: $u * 1.75;
        background-color: #e1e1e1;
    }

    > .Backspace {
        width: $u * 2;
        background-color: #e1e1e1;
    }

    > .ShiftLeft,
    .Enter {
        width: $u * 2.25;
        background-color: #e1e1e1;
    }

    > .Enter {
        background-color: #a2f5e6;
    }

    > .ShiftRight {
        width: $u * 2.75;
        background-color: #e1e1e1;
    }

    > .Space {
        width: $u * 6.25;
        background-color: white;
    }

    > .key {
        transition-property: background-color;
        transition-timing-function: ease-out;
        transition-duration: 0.5s;

        &.blink {
            background-color: grey;
            transition-duration: 0s;
        }
    }
}
</style>
