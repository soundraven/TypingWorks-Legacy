<template>
    <div>
        <p>다음 문구를 따라 작성</p>
        <p>{{ targetTxt }}</p>
        <input
            v-model="typedTxt"
            type="text"
            autofocus
            @input="
                startTyping();
                currentTyping();
            "
            @keyup.enter="endTyping"
        />
        <p>타이핑 속도: {{ wpm }} WPM</p>
        <p>타이핑 속도: {{ cpm }} CPM</p>
        <p>타이핑 시작 시간: {{ startTime }}</p>
        <p>타이핑 끝난 시간: {{ endTime }}</p>
        <p>마지막으로 한 타이핑 시간: {{ lastTypingTime }}</p>
        <p>elapsedTime: {{ elapsedTime }}</p>
    </div>
</template>

<script setup lang="ts">
const targetTxt = "The quick brown fox jumps over the lazy dog";
const typedTxt = ref("");

const wpm = ref(0);
const cpm = ref(0);

const startTime = ref(0);
const lastTypingTime = ref(0);
const elapsedTime = ref(0);
const endTime = ref(0);
const totalTime = ref(0);

const startTyping = () => {
    if (startTime.value === 0) {
        const date = new Date();
        startTime.value = date.getTime();
    }
};

const currentTyping = () => {
    if (startTime.value !== 0) {
        const date = new Date();
        lastTypingTime.value = date.getTime();
        elapsedTime.value = (lastTypingTime.value - startTime.value) / 1000;
    }
    calcTypingSpeed(elapsedTime.value);
};

const endTyping = () => {
    const date = new Date();
    endTime.value = date.getTime();
    totalTime.value = (endTime.value - startTime.value) / 1000;

    calcTypingSpeed(totalTime.value);

    typedTxt.value = "";
    startTime.value = 0;
    elapsedTime.value = 0;
};

const calcTypingSpeed = (takenTime) => {
    const totalWords = typedTxt.value.trim();
    const actualWords = totalWords === "" ? 0 : totalWords.split(" ").length;

    if (actualWords !== 0) {
        wpm.value = Math.round((actualWords / takenTime) * 60);
    }

    if (totalWords.length !== 0) {
        cpm.value = Math.round((totalWords.length / takenTime) * 60);
    }
};
</script>
