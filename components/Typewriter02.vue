<template>
    <div>
        <p>다음 문구를 따라 작성</p>
        <p>{{ targetText }}</p>
        <input v-model="typedText" type="text" autofocus />
        <p>타이핑 속도: {{ wpm }} WPM</p>
        <p>타이핑 속도: {{ cpm }} CPM</p>

        <button @click="startTyping()">Start</button>
        <button @click="endTyping()">End</button>
    </div>
</template>

<script setup lang="ts">
const targetText = "The quick brown fox jumps over the lazy dog";
const typedText = ref("");

let wpm = 0;
let cpm = 0;

let startTime = 0;
let endTime = 0;
let totalTime = 0;

// wpm = Math.floor((60 / typeCount) * correctChr)
// if (wpm === Infinity || isNaN(wpm)) {
//     return 0;
// }

const startTyping = () => {
    const date = new Date();
    startTime = date.getTime();
};

const endTyping = () => {
    const date = new Date();
    endTime = date.getTime();

    totalTime = (endTime - startTime) / 1000;

    calculateTypingSpeed(totalTime);

    // typedText.value = ""
};

const calculateTypingSpeed = (takenTime) => {
    const totalWords = typedText.value.trim();
    const actualWords = totalWords === "" ? 0 : totalWords.split(" ").length;

    if (actualWords !== 0) {
        wpm = (actualWords / takenTime) * 60;
        wpm = Math.round(wpm);
    }

    if (totalWords.length !== 0) {
        cpm = (totalWords.length / takenTime) * 60;
        cpm = Math.round(cpm);
    }

    typedText.value = "";
};
</script>
