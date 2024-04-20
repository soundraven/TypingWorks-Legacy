<template>
    <div>예제</div>
    <div>
        <ul>
            <li
                v-for="(color, index) of colors"
                :key="color"
                @click="$colorMode.preference = color"
            >
                {{ color }}
                <component :is="`Icon${color}`" />
            </li>
        </ul>
    </div>
    <component :is="MyButton" />
</template>
<VueExample />
<script setup>
const colorMode = useColorMode()
const colors = ["System", "Light", "Dark", "Sepia"]
</script>

<style></style>
