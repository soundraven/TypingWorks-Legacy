<template>
    <div>
        <p>다음 문구를 따라 작성</p>
        <p>
            <template v-for="(char, index) in splitedTargetTxt" :key="index">
                <span :class="{ [$style.typo]: typoArray[index] }">
                    {{ char }}
                </span>
            </template>
        </p>

        <input
            v-model="typedTxt"
            type="text"
            autofocus
            @input="startTyping"
            @keyup.enter="endTyping"
        />
        <p>타이핑 속도: {{ wpm }} WPM</p>
        <p>타이핑 속도: {{ cpm }} CPM</p>
        <p>타이핑 시작 시간: {{ startTime }}</p>
        <p>타이핑 끝난 시간: {{ endTime }}</p>
        <p>마지막으로 한 타이핑 시간: {{ lastTypingTime }}</p>
        <p>elapsedTime: {{ elapsedTime }}</p>
        <p>한글/영어 {{ targetLanguage }}</p>
        <button @click="toggleLanguage()">한글/영어 변환</button>
    </div>
</template>

<script setup lang="ts">
import * as hangul from "hangul-js";
// 원본 문장
// const targetTxt = "The quick brown fox jumps over the lazy dog";
// const targetTxt = "동해물과 백두산이 마르고 닳도록";
const targetTxt = ref("");
const targetLanguage = ref("ko");
// 원본 문장을 글자 단위로 분할
// const splitedTargetTxt = targetTxt.value.split("");
const splitedTargetTxt = ref<string[]>([]);
// 유저가 타이핑한 문장
const typedTxt = ref("");
// 쪼갠 문장의 길이와 동일한 새 배열 생성, 각 요소는 false
// const typoArray = ref(new Array(splitedTargetTxt.value.length).fill(false));
// const typoArray = ref<boolean[]>([]);
const typoArray = ref<boolean[]>([]);

const wpm = ref(0);
const cpm = ref(0);

const startTime = ref(0);
const lastTypingTime = ref(0);
// 현재 경과시간만 초로 나오고 나머지는 타임스탬프 형식
const elapsedTime = ref(0);
const endTime = ref(0);
const totalTime = ref(0);

// 경과시간 계산 반복하는 setTimeOut Id
let elapsedTimerId;

onMounted(() => {
    if (targetLanguage.value === "ko") {
        targetTxt.value = "동해물과 백두산이 마르고 닳도록";
        readyTxt();
    } else {
        targetTxt.value = "The quick brown fox jumps over the lazy dog";
        readyTxt();
    }
});

const readyTxt = () => {
    splitedTargetTxt.value = targetTxt.value.split("");
    typoArray.value = new Array(splitedTargetTxt.value.length).fill(false);
};

const startTyping = () => {
    if (startTime.value === 0) {
        const date = new Date();
        startTime.value = date.getTime();
        startTypingSpeedCalc();
    }
    currentTyping();
    checkTypo();
};

const currentTyping = () => {
    if (startTime.value !== 0) {
        const date = new Date();
        lastTypingTime.value = date.getTime();
        elapsedTime.value = (lastTypingTime.value - startTime.value) / 1000;
    }
    calcTypingSpeed(elapsedTime.value);
};

// typoArray에서 true인 i는 오타를 의미
const checkTypo = () => {
    for (let i = 0; i < targetTxt.value.length; i++) {
        if (typedTxt.value[i] && typedTxt.value[i] !== targetTxt.value[i]) {
            typoArray.value[i] = true;
        } else {
            typoArray.value[i] = false;
        }
    }
};

const keepCheckElapsedTime = () => {
    const date = new Date();
    const currentTime = date.getTime();
    elapsedTime.value = (currentTime - startTime.value) / 1000;
    calcTypingSpeed(elapsedTime.value);
};

const startTypingSpeedCalc = () => {
    elapsedTimerId = setTimeout(function repeat() {
        keepCheckElapsedTime();
        elapsedTimerId = setTimeout(repeat, 100);
    }, 100);
};

const stopTypingSpeedCalc = () => {
    clearTimeout(elapsedTimerId);
};

const endTyping = () => {
    stopTypingSpeedCalc();

    const date = new Date();
    endTime.value = date.getTime();
    totalTime.value = (endTime.value - startTime.value) / 1000;

    calcTypingSpeed(totalTime.value);

    typedTxt.value = "";
    startTime.value = 0;
    elapsedTime.value = 0;
};

// 한글과 영어 속도 계산을 다르게 처리
const calcTypingSpeed = (takenTime) => {
    const totalWords = typedTxt.value.trim();
    const actualWords = totalWords === "" ? 0 : totalWords.split(" ").length;
    if (targetTxt.value.match(/^[a-zA-Z]+$/)) {
        if (actualWords !== 0) {
            wpm.value = Math.round((actualWords / takenTime) * 60);
        }
        if (totalWords.length !== 0) {
            cpm.value = Math.round((totalWords.length / takenTime) * 60);
        }
    } else {
        const disassembleTxt = hangul.disassemble(typedTxt.value);
        if (actualWords !== 0) {
            wpm.value = Math.round((actualWords / takenTime) * 60);
        }
        if (disassembleTxt.length !== 0) {
            cpm.value = Math.round((disassembleTxt.length / takenTime) * 60);
        }
    }
    // 계산 공식에 문제 있는 것 같음. 나중에 다시 확인하기
};

const toggleLanguage = () => {
    if (targetLanguage.value === "ko") {
        targetLanguage.value = "en";
        targetTxt.value = "The quick brown fox jumps over the lazy dog";
        readyTxt();
    } else {
        targetLanguage.value = "ko";
        targetTxt.value = "동해물과 백두산이 마르고 닳도록";
        readyTxt();
    }
};
</script>

<style lang="scss" module>
.typo {
    color: red;
}
</style>
