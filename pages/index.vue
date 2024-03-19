<template>
    <div>
        <ExampleComponent />
        <p>main index page</p>
        <p>utils index: {{ indexNumberFormat(123456) }}</p>
        <p>utils named: {{ numberFormat(123456) }}</p>
        <p>lodash: {{ $_.join(array, "") }}</p>
        <p>vueuse useMouse: {{ x }}, {{ y }}</p>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: ["auth"],
});

const array = ref([1, 2, 3]);
const { x, y } = useMouse();
</script>
