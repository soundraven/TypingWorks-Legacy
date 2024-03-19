<template>
    <div>
        <p>Press any key to start measuring time. Press Enter to stop.</p>
        <p v-if="startTime !== null">Time elapsed: {{ elapsedTime }} seconds</p>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const startTime = ref(null);
const elapsedTime = ref(null);

onMounted(() => {
    window.addEventListener("keydown", startTimer);
});

function startTimer(event) {
    if (event.key === "Enter" && startTime.value !== null) {
        clearInterval(intervalId);
        const endTime = Date.now();
        elapsedTime.value = ((endTime - startTime.value) / 1000).toFixed(2);
        startTime.value = null;
    } else if (startTime.value === null) {
        startTime.value = Date.now();
        intervalId = setInterval(updateElapsedTime, 100); // Update elapsed time every 100 milliseconds
    }
}

function updateElapsedTime() {
    if (startTime.value !== null) {
        const currentTime = Date.now();
        elapsedTime.value = ((currentTime - startTime.value) / 1000).toFixed(2);
    }
}
</script>
