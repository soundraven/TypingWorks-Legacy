<template>
    <div>
        <!-- <NuxtWelcome /> -->
        <NuxtLayout>
            <NuxtPage />
            {{ nuxtApp?.$app_origin }}
        </NuxtLayout>
        <TypeArea />
        <el-button @click="ElMessage('hello')">button</el-button>
        <ElButton :icon="ElIconEditPen" type="success">button</ElButton>
        <LazyElButton type="warning">lazy button</LazyElButton>
        <div>
            <el-button>Default</el-button>
            <el-icon><User style="font-size: 24px" /></el-icon>
        </div>
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
