<template>
    <div>
        {{ reactiveStr }}
    </div>
</template>

<script setup lang="ts">
const reactiveStr: Ref<string> = ref("")

const str: string = "asdf"
const num: number = 0
const bool: boolean = false
const strs: string[] = ["1", "2", "3"]
const date: Date = new Date()
const asdfasd: any = 123
const nullable: string | null = null
const functionable: () => number = (): number => {
    return 0
}

// function myFunction(): number {
//     return 0;
// }

const myFunction = (): number => {
    return 0
}

// strs = 1

onMounted(() => {
    reactiveStr.value =
        '<br><b>HiHello</b><img onerror="document.cookie" src="a">'
})
</script>
