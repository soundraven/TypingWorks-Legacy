<template>
    <div :class="$style.index">
        <div :class="$style.typing">
            <div :class="$style.text">
                <span
                    v-for="(char, index) in splitedTargetTxt"
                    :key="index"
                    :class="[getTypoClass(index)]"
                >
                    {{ char }}
                </span>
            </div>
            <div :class="$style.person">
                {{ targetPerson }}
            </div>
        </div>

        <div :class="$style.inputs">
            <input
                v-model="typedTxt"
                type="text"
                autofocus
                @keyup="keydownEventHandler"
                @keyup.enter="endTyping"
            />
        </div>

        <p>타이핑 속도: {{ wpm }} WPM</p>
        <p>타이핑 속도: {{ cpm }} CPM</p>
        <p>타이핑 시작 시간: {{ startTime }}</p>
        <p>타이핑 끝난 시간: {{ endTime }}</p>
        <p>
            마지막으로 한 타이핑 시간:
            {{ new Date(lastTypingTime).toLocaleTimeString() }}
        </p>
        <p>elapsedTime: {{ getElapsedTime() }}</p>
        <p>한글/영어 {{ targetLanguage }}</p>
        <p>정확도: {{ typingAccuracy }}%</p>
        <p>진행도: {{ typingProgress }}%</p>
        <button @click="toggleLanguage()">한글/영어 변환</button>
    </div>
</template>

<script setup lang="ts">
import * as hangul from "hangul-js"
import EnQuotes from "@/assets/LifeQuotesEN.json"
import KrQuotes from "@/assets/LifeQuotesKR.json"
import { TypoStatus, type Quote } from "~/structure/quotes"

const $style = useCssModule()
//v-memo 확인해보기
const targetPerson: Ref<string> = ref("")
const targetTxt: Ref<string> = ref("")
const targetLanguage: Ref<string> = ref("ko")
const splitedTargetTxt: Ref<string[]> = ref([])
// 유저가 타이핑한 문장
const typedTxt: Ref<string> = ref("")
const parsingText: Ref<string> = ref("")

// 쪼갠 문장의 길이와 동일한 새 배열 생성, 각 요소는 false
const typoArray: Ref<boolean[]> = ref([])

// 문장 입력 상태 혹은 틀림/맞음 체크
const typoStatus: Ref<{ [k: number]: TypoStatus }> = ref({})

const typingAccuracy = ref(0)
const typingProgress = ref(0)

const wpm = ref(0)
const cpm = ref(0)

const startTime = ref(0)
const lastTypingTime = ref(0)
// 현재 경과시간만 초로 나오고 나머지는 타임스탬프 형식
const elapsedTime = ref(0)
const endTime = ref(0)
const totalTime = ref(0)

// 경과시간 계산 반복하는 setTimeOut Id
const elapsedTimerId: Ref<NodeJS.Timeout | undefined> = ref(undefined)

// onBeforeMount(() => {})

onMounted(() => {
    if (process.server) return

    const target = getTargetTxt(targetLanguage)
    targetTxt.value = target.quote
    targetPerson.value = target.person
    readyTxt()

    // console.log(TypoStatus.NotInput)

    // window.addEventListener
})
//타입캐스팅
const keydownEventHandler = (e: KeyboardEvent) => {
    startTyping((e.currentTarget as HTMLInputElement).value)
}

// const onChangeEventHandler = (e: Event) => {
//     console.log("b", (e.currentTarget as HTMLInputElement).value)
// }

const startTyping = (text: string) => {
    parsingText.value = text

    // 시작시 startTime 체크
    if (startTime.value === 0) {
        const date = new Date()
        startTime.value = date.getTime()
        startTypingSpeedCalc()
    }
    // startTime 있으면 속도, 오타만 검사
    currentTyping()
    checkTypo()
    accuracy()
    progress()
}

// 마지막으로 타이핑한 시간 기준으로 경과시간을 계산
const currentTyping = () => {
    const date = new Date()
    lastTypingTime.value = date.getTime()
    elapsedTime.value = (lastTypingTime.value - startTime.value) / 1000
    // 경과시간을 받아 속도 계산
    calcTypingSpeed(elapsedTime.value)
}

// typoArray에서 true인 i는 오타를 의미
const checkTypo = () => {
    typoStatus.value = {}

    /*
    if (typedTxt.value.length <= i)
        if (typedTxt.value[i] && typedTxt.value[i] !== targetTxt.value[i]) {
            typoStatus.value[i] = TypoStatus.Error
        } else {
            typoStatus.value[i] = TypoStatus.Correct
        } */
    // console.log(typedTxt.value)
    for (let i = 0; i < parsingText.value.length; i++) {
        if (targetTxt.value[i] == undefined) continue
        if (targetTxt.value[i] == parsingText.value[i]) {
            typoStatus.value[i] = TypoStatus.Correct
        } else {
            typoStatus.value[i] = TypoStatus.Error
        }
    }

    // console.log(typoStatus.value)
}

// 입력 텍스트의 정확도 계산
const accuracy = () => {
    const typoCount = typoArray.value.filter((value) => value === true).length
    typingAccuracy.value = Math.round(
        ((typoArray.value.length - typoCount) / typoArray.value.length) * 100,
    )
}

const progress = () => {
    typingProgress.value = getPercentage(
        parsingText.value.split("").length,
        targetTxt.value.split("").length,
    )
    // Math.round(
    //     (typedTxt.value.split("").length / targetTxt.value.split("").length) *
    //         100,
    // )
}
// 현재 시간 기준으로 경과시간 및 타이핑 속도 계산
const keepCheckElapsedTime = () => {
    const date = new Date()
    const currentTime = date.getTime()
    elapsedTime.value = (currentTime - startTime.value) / 1000
    calcTypingSpeed(elapsedTime.value)
}

// setTimeout 이용해 0.1초마다 속도 계산
const startTypingSpeedCalc = () => {
    elapsedTimerId.value = setTimeout(function repeat() {
        keepCheckElapsedTime()
        elapsedTimerId.value = setTimeout(repeat, 100)
    }, 100)
}

const stopTypingSpeedCalc = () => {
    clearTimeout(elapsedTimerId.value)
}

const endTyping = () => {
    typoStatus.value = {}
    stopTypingSpeedCalc()

    const date = new Date()
    endTime.value = date.getTime()
    totalTime.value = (endTime.value - startTime.value) / 1000

    calcTypingSpeed(totalTime.value)

    const target = getTargetTxt(targetLanguage)
    targetTxt.value = target.quote
    targetPerson.value = target.person
    readyTxt()
    resetInfo()
}

const resetInfo = () => {
    stopTypingSpeedCalc()
    typedTxt.value = ""
    parsingText.value = ""
    startTime.value = 0
    elapsedTime.value = 0
    wpm.value = 0
    cpm.value = 0
    typingAccuracy.value = 0
    typingProgress.value = 0
}

// 한글과 영어 속도 계산을 다르게 처리
const calcTypingSpeed = (takenTime) => {
    const totalWords = parsingText.value.trim()
    const splitByWords = totalWords === "" ? 0 : totalWords.split(" ").length
    if (targetTxt.value.match(/^[a-zA-Z]+$/)) {
        if (splitByWords !== 0) {
            wpm.value = Math.round((splitByWords / takenTime) * 60)
        }
        if (totalWords.length !== 0) {
            cpm.value = Math.round((totalWords.length / takenTime) * 60)
        }
    } else {
        const disassembleTxt = hangul.disassemble(parsingText.value)
        if (splitByWords !== 0) {
            wpm.value = Math.round((splitByWords / takenTime) * 60)
        }
        if (disassembleTxt.length !== 0) {
            cpm.value = Math.round((disassembleTxt.length / takenTime) * 60)
        }
    }
    // 계산 공식에 문제 있는 것 같음. 속도가 너무 빠르게 나오는?
}

const toggleLanguage = () => {
    targetLanguage.value = targetLanguage.value == "ko" ? "en" : "ko"

    // if (targetLanguage.value === "ko") {
    //     targetLanguage.value = "en"
    // } else {
    //     targetLanguage.value = "ko"
    // }

    const target = getTargetTxt(targetLanguage)
    targetTxt.value = target.quote
    targetPerson.value = target.person

    readyTxt()
    resetInfo()
}

// 오타 확인을 위해 문장 글자단위로 분해
const readyTxt = () => {
    splitedTargetTxt.value = targetTxt.value.split("")
    typoArray.value = new Array(splitedTargetTxt.value.length).fill(false)
}

const getTargetTxt = (language: Ref<string>): Quote => {
    let targetDatas: Quote[] = []
    if (language.value === "en") {
        targetDatas = EnQuotes
    } else {
        targetDatas = KrQuotes
    }

    const randomIndex = Math.floor(Math.random() * targetDatas.length)
    return targetDatas[randomIndex]
}

const getTypoClass = (index: number): string => {
    if (typoStatus.value[index] == null) return ""

    if (typoStatus.value[index] == TypoStatus.Error) return $style.typo
    return $style.success
}

const getElapsedTime = (): string => {
    const min = Math.floor(elapsedTime.value / 60)
    const sec = elapsedTime.value % 60

    return `${min}분 ${sec}초`
}
</script>

<style lang="scss" module>
.index {
    width: 100%;
    min-height: 100dvh;

    display: flex;
    align-items: center;
    justify-content: center;

    flex-direction: column;

    > .typing {
        width: 100%;
        padding-inline: 60px;

        > .text {
            font-size: 60px;

            > span {
                transition-property: color;
                transition-duration: 0.2s;
                transition-timing-function: ease-out;
            }

            .typo {
                color: red;
            }
            .success {
                color: blue;
            }
        }
        > .person {
            color: #ccc;
            font-size: 20px;
            font-style: italic;

            margin-top: 10px;
        }
    }
    > .inputs {
        width: 100%;
        padding-inline: 60px;

        > input {
            width: 100%;

            outline: none;
            border: none;
            border-bottom: 1px solid #ccc;

            padding: 10px;
            padding-inline: 20px;

            font-size: 60px;

            color: black;
        }
    }
}
</style>
