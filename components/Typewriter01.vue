<template>
    <div>
        <p>{{ originalText }}</p>
        <input
            v-model="userInput"
            type="text"
            @keydown="startTyping"
            @keyup.enter="stopTyping"
        />
        <p>경과 시간: {{ elapsedTime }} 초</p>
        <p>오타 수: {{ typoCount }}</p>
        <p>정확도: {{ accuracy }}%</p>
        <p>WPM: {{ wpm }}</p>
        <p>CPM: {{ cpm }}</p>
    </div>
</template>

<script setup>
import { ref, watchEffect } from "vue";

const originalText = "The quick brown fox jumps over the lazy dog.";
const userInput = ref("");
const startTime = ref(null);
const endTime = ref(null);
// const elapsedTime = ref(0)

const startTyping = () => {
    if (startTime.value === null) {
        startTime.value = Date.now();
    }
};

const stopTyping = () => {
    endTime.value = Date.now();
    userInput.value = "";
    startTime.value = null;
};

const elapsedTime = computed(() => {
    return Date.now() - startTime.value;
});

watchEffect(() => {
    if (startTime.value !== null) {
        elapsedTime.value = (Date.now() - startTime.value) / 1000;
    }
});

const typoCount = computed(() => {
    return [...userInput.value].reduce(
        (acc, curr, idx) => acc + (curr !== originalText[idx] ? 1 : 0),
        0,
    );
});

const accuracy = computed(() => {
    return userInput.value
        ? ((originalText.length - typoCount.value) / originalText.length) * 100
        : 100;
});

const wpm = computed(() => {
    return elapsedTime.value
        ? ((originalText.split(" ").length / elapsedTime.value) * 60) / 5
        : 0;
});

const cpm = computed(() => {
    return elapsedTime.value
        ? (originalText.length / elapsedTime.value) * 60
        : 0;
});
</script>
