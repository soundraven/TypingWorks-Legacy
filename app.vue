<template>
    <div>
        <!-- <NuxtWelcome /> -->
        <NuxtLayout>
            <NuxtPage />
            {{ nuxtApp?.$app_origin }}
        </NuxtLayout>

        <Typewriter02 />
    </div>
</template>

<script setup>
const nuxtApp = useNuxtApp();
const runtimeConfig = useRuntimeConfig();

const { data: exampleApi } = await useFetch("/api/exampleApi");
console.log("[ExampleAPI]", exampleApi.value);
onMounted(() => {
    console.log("[ON MOUNTED]", runtimeConfig);
});
</script>
