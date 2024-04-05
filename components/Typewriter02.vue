<template>
    <div>
        <p>다음 문구를 따라 작성</p>
        <p>
            {{ targetPerson }}
            <br />
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
        <p>정확도: {{ typoRate }}%</p>
        <button @click="toggleLanguage()">한글/영어 변환</button>
    </div>
</template>

<script setup lang="ts">
import * as hangul from "hangul-js";
import EnQuotes from "@/assets/LifeQuotesEN";
import KrQuotes from "@/assets/LifeQuotesKR";

const targetPerson = ref("");
const targetTxt = ref("");
const targetLanguage = ref("ko");
const splitedTargetTxt = ref<string[]>([]);
// 유저가 타이핑한 문장
const typedTxt = ref("");
// 쪼갠 문장의 길이와 동일한 새 배열 생성, 각 요소는 false
const typoArray = ref<boolean[]>([]);
const typoRate = ref(0);

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
    const target = getTargetTxt(targetLanguage);
    targetTxt.value = target.quote;
    targetPerson.value = target.person;
    readyTxt();
});

const startTyping = () => {
    // 시작시 startTime 체크
    if (startTime.value === 0) {
        const date = new Date();
        startTime.value = date.getTime();
        startTypingSpeedCalc();
    }
    // startTime 있으면 속도, 오타만 검사
    currentTyping();
    checkTypo();
    accuracy();
};

// 마지막으로 타이핑한 시간 기준으로 경과시간을 계산
const currentTyping = () => {
    const date = new Date();
    lastTypingTime.value = date.getTime();
    elapsedTime.value = (lastTypingTime.value - startTime.value) / 1000;
    // 경과시간을 받아 속도 계산
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

// 입력 텍스트의 정확도 계산
const accuracy = () => {
    const typoCount = typoArray.value.filter((value) => value === true).length;
    typoRate.value = Math.round(
        ((typoArray.value.length - typoCount) / typoArray.value.length) * 100,
    );
};

// 현재 시간 기준으로 경과시간 및 타이핑 속도 계산
const keepCheckElapsedTime = () => {
    const date = new Date();
    const currentTime = date.getTime();
    elapsedTime.value = (currentTime - startTime.value) / 1000;
    calcTypingSpeed(elapsedTime.value);
};

// setTimeout 이용해 0.1초마다 속도 계산
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

    const target = getTargetTxt(targetLanguage);
    targetTxt.value = target.quote;
    targetPerson.value = target.person;
    readyTxt();

    typedTxt.value = "";
    startTime.value = 0;
    elapsedTime.value = 0;
};

// 한글과 영어 속도 계산을 다르게 처리
const calcTypingSpeed = (takenTime) => {
    const totalWords = typedTxt.value.trim();
    const splitByWords = totalWords === "" ? 0 : totalWords.split(" ").length;
    if (targetTxt.value.match(/^[a-zA-Z]+$/)) {
        if (splitByWords !== 0) {
            wpm.value = Math.round((splitByWords / takenTime) * 60);
        }
        if (totalWords.length !== 0) {
            cpm.value = Math.round((totalWords.length / takenTime) * 60);
        }
    } else {
        const disassembleTxt = hangul.disassemble(typedTxt.value);
        if (splitByWords !== 0) {
            wpm.value = Math.round((splitByWords / takenTime) * 60);
        }
        if (disassembleTxt.length !== 0) {
            cpm.value = Math.round((disassembleTxt.length / takenTime) * 60);
        }
    }
    // 계산 공식에 문제 있는 것 같음. 속도가 너무 빠르게 나오는?
};

const toggleLanguage = () => {
    if (targetLanguage.value === "ko") {
        targetLanguage.value = "en";
    } else {
        targetLanguage.value = "ko";
    }
    const target = getTargetTxt(targetLanguage);
    targetTxt.value = target.quote;
    targetPerson.value = target.person;
    readyTxt();
};

// 오타 확인을 위해 문장 글자단위로 분해
const readyTxt = () => {
    splitedTargetTxt.value = targetTxt.value.split("");
    typoArray.value = new Array(splitedTargetTxt.value.length).fill(false);
};

const getTargetTxt = (language) => {
    let targetJson = "";
    if (language.value === "en") {
        targetJson = EnQuotes;
    } else {
        targetJson = KrQuotes;
    }

    const randomIndex = Math.floor(Math.random() * targetJson.length);

    return {
        quote: targetJson[randomIndex].quote,
        person: targetJson[randomIndex].person,
    };
};
</script>

<style lang="scss" module>
.typo {
    color: red;
}
</style>
