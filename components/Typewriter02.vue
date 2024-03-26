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
    </div>
</template>

<script setup lang="ts">
// 원본 문장
// const targetTxt = "The quick brown fox jumps over the lazy dog";
const targetTxt = "동해물과 백두산이 마르고 닳도록";
// 원본 문장을 글자 단위로 분할
const splitedTargetTxt = targetTxt.split("");
// 유저가 타이핑한 문장
const typedTxt = ref("");
// 쪼갠 문장의 길이와 동일한 새 배열 생성, 각 요소는 false
const typoArray = ref(new Array(splitedTargetTxt.length).fill(false));

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

const startTyping = () => {
    if (startTime.value === null || 0) {
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
    console.log(typedTxt.value);
    console.log(typoArray.value);
    for (let i = 0; i < targetTxt.length; i++) {
        if (typedTxt.value[i] && typedTxt.value[i] !== targetTxt[i]) {
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

const calcTypingSpeed = (takenTime) => {
    const totalWords = typedTxt.value.trim();
    const actualWords = totalWords === "" ? 0 : totalWords.split(" ").length;
    // 계산 공식에 문제 있는 것 같음. 나중에 다시 확인하기
    if (actualWords !== 0) {
        wpm.value = Math.round((actualWords / takenTime) * 60);
    }

    if (totalWords.length !== 0) {
        cpm.value = Math.round((totalWords.length / takenTime) * 60);
    }
};
</script>

<style lang="scss" module>
.typo {
    color: red;
}
</style>
