<template>
    <div :class="$style.index">
        <div :class="$style.typing">
            <div :class="[$style.icon, $style.gridItem]">로고위치</div>
            <div :class="[$style.language, $style.gridItem]" v-auto-animate>
                <!-- <div
                    :class="[$style.langBtn, getActiveClass(Language.Korean)]"
                    @click="toggleLanguage(Language.Korean)"
                >
                    Ko
                </div>
                <div
                    :class="[$style.langBtn, getActiveClass(Language.English)]"
                    @click="toggleLanguage(Language.English)"
                >
                    En
                </div> -->
                <div
                    v-for="btn in toggleLangBtn"
                    :key="btn"
                    :class="[$style.langBtn, getActiveClass(btn)]"
                    @click="toggleLanguage(btn)"
                >
                    {{ btn }}
                </div>
            </div>
            <div :class="[$style.screenMode, $style.gridItem]">
                <ColorModePicker />
            </div>
            <div :class="[$style.blinkBox, $style.gridItem]">
                <TypingBlink />
            </div>
            <div :class="[$style.sentence, $style.gridItem]">문장변경</div>
            <div :class="[$style.wpm, $style.gridItem]">WPM: {{ wpm }}</div>
            <div :class="[$style.cpm, $style.gridItem]">CPM: {{ cpm }}</div>
            <div :class="[$style.accuracy, $style.gridItem]">
                정확도: {{ typingAccuracy }}
            </div>
            <div :class="[$style.progress, $style.gridItem]">
                진행도: {{ typingProgress }}
            </div>
            <div :class="[$style.count, $style.gridItem]">
                count: {{ typingCount }}
            </div>
            <div :class="[$style.keyTheme, $style.gridItem]">
                {{ getElapsedTime() }}
            </div>
            <div :class="[$style.person, $style.gridItem]">
                {{ targetPerson }}
            </div>
            <div :class="[$style.textArea, $style.gridItem]">
                <div :class="$style.text">
                    <span
                        v-for="(char, index) in splitedTargetText"
                        :key="index"
                        :class="[getTypoClass(index)]"
                    >
                        {{ char }}
                    </span>
                </div>
                <div :class="$style.inputs">
                    <input
                        v-on:input="updateTypedText($event)"
                        v-bind:value="typedText"
                        type="text"
                        autofocus
                        placeholder="위에 보이는 문장을 따라 타이핑해보세요."
                        @keyup="keyupEventHandler"
                        @keydown.enter.prevent="endTyping"
                        @paste="preventPaste"
                    />
                </div>
                <div :class="$style.nextText">{{ nextText }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { disassemble } from "hangul-js"
import { TypoStatus, Language, type Quote } from "~/structure/quotes"
import EnQuotes from "@/assets/quotes/quotesEn.json"
import KrQuotes from "@/assets/quotes/quotesKo.json"
import { vAutoAnimate } from "@formkit/auto-animate"

//겹칠때 AS 쓸수있다
import { throttle as LodashThrottle } from "lodash"

// import type Quote from "~"
const $style = useCssModule()
const runtime = useRuntimeConfig()
import autoAnimate from "@formkit/auto-animate"

//v-memo 확인해보기
const targetPerson: Ref<string> = ref("")
const targetText: Ref<string> = ref("")
const nextPerson: Ref<string> = ref("")
const nextText: Ref<string> = ref("")
const targetLanguage: Ref<Language> = ref(Language.Korean)
const splitedTargetText: Ref<string[]> = ref([])
// 유저가 타이핑한 문장
const typedText: Ref<string> = ref("")
const parsingText: Ref<string> = ref("")
const typingCount: Ref<number> = ref(0)

// 쪼갠 문장의 길이와 동일한 새 배열 생성, 각 요소는 false
const typoArray: Ref<boolean[]> = ref([])
// 문장 입력 상태 혹은 틀림/맞음 체크
const typoStatus: Ref<{ [k: number]: TypoStatus }> = ref({})

const typingAccuracy: Ref<number> = ref(0)
const typingProgress: Ref<number> = ref(0)
const wpm: Ref<number> = ref(0)
const cpm: Ref<number> = ref(0)

const startTime: Ref<number> = ref(0)
const lastTypingTime: Ref<number> = ref(0)
// 현재 경과시간만 초로 나오고 나머지는 타임스탬프 형식
const elapsedTime: Ref<number> = ref(0)
const endTime: Ref<number> = ref(0)
const totalTime: Ref<number> = ref(0)

let toggleLangBtn: Language[] = [Language.Korean, Language.English]

// 경과시간 계산 반복하는 setTimeOut Id
const elapsedTimerId: Ref<NodeJS.Timeout | undefined> = ref(undefined)

onMounted(() => {
    if (process.server) return
    // runtime.public.API
    const [currentQuote, nextQuote] = getTargetText()
    targetText.value = currentQuote.quote
    targetPerson.value = currentQuote.person
    nextText.value = nextQuote.quote
    readyText()
})

//타입캐스팅
const keyupEventHandler = (e: KeyboardEvent) => {
    if (e.code === "Enter") return

    startTyping((e.currentTarget as HTMLInputElement).value, e)
}

const preventPaste = (e: ClipboardEvent) => {
    e.preventDefault()
}

const updateTypedText = (e) => {
    typedText.value = (e.target as HTMLInputElement).value
}

const startTyping = (
    text: string,
    e: KeyboardEvent | undefined = undefined,
) => {
    parsingText.value = text

    // 시작시 startTime 체크
    if (startTime.value === 0) {
        const date = new Date()
        startTime.value = date.getTime()
        startTypingSpeedCalc()
    }

    // startTime 있으면 속도, 오타만 검사
    currentTyping()
    accuracy()
    progress()
    checkTypo()

    if (
        targetLanguage.value != Language.Korean ||
        e?.key.toLowerCase() == "space" ||
        e?.key.toLowerCase() == "backspace"
    ) {
        checkTypo()
    }
}

// 마지막으로 타이핑한 시간 기준으로 경과시간을 계산
const currentTyping = () => {
    const date = new Date()
    lastTypingTime.value = date.getTime()
    elapsedTime.value = (lastTypingTime.value - startTime.value) / 1000
}

// typoArray에서 true인 i는 오타를 의미
const checkTypo = () => {
    typoStatus.value = {}

    //조합문자 조합중 오타로 체크되는것 해결을 위해 i + 1로 수정
    for (let i = 0; i + 1 < parsingText.value.length; i++) {
        if (targetText.value[i] == undefined) continue
        if (targetText.value[i] == parsingText.value[i]) {
            typoStatus.value[i] = TypoStatus.Correct
        } else {
            typoStatus.value[i] = TypoStatus.Error
        }
    }
}

// 입력 텍스트의 정확도 계산
const accuracy = () => {
    const typoCount = typoArray.value.filter(
        (value: boolean) => value === true,
    ).length
    typingAccuracy.value = Math.round(
        ((typoArray.value.length - typoCount) / typoArray.value.length) * 100,
    )
}

const progress = () => {
    typingProgress.value = getPercentage(
        parsingText.value.split("").length,
        targetText.value.split("").length,
    )
}
// 현재 시간 기준으로 경과시간 및 타이핑 속도 계산

// setTimeout 이용해 0.1초마다 속도 계산
//requestanimationframe 사용해서 주사율 기준으로 가능
const startTypingSpeedCalc = () => {
    elapsedTimerId.value = setInterval(keepCheckElapsedTime, 100)
}

const keepCheckElapsedTime = () => {
    const date = new Date()
    const currentTime: number = date.getTime()
    elapsedTime.value = (currentTime - startTime.value) / 1000
    calcTypingSpeed(elapsedTime.value)
}

const stopTypingSpeedCalc = () => {
    clearInterval(elapsedTimerId.value)
}

const endTyping = () => {
    typingCount.value += +1

    typoStatus.value = {}
    stopTypingSpeedCalc()

    const date = new Date()
    endTime.value = date.getTime()
    totalTime.value = (endTime.value - startTime.value) / 1000

    calcTypingSpeed(totalTime.value)

    const [target, nextTarget] = getTargetText()
    targetText.value = nextText.value
    targetPerson.value = nextPerson.value
    nextText.value = nextTarget.quote
    nextPerson.value = nextTarget.person

    readyText()
    resetInfo()
}

const resetInfo = () => {
    typedText.value = ""
    parsingText.value = ""
    startTime.value = 0
    elapsedTime.value = 0
    wpm.value = 0
    cpm.value = 0
    typingAccuracy.value = 0
    typingProgress.value = 0
}

const calcTypingSpeed = (takenTime: number) => {
    if (takenTime === 0) return
    const totalWords: string = parsingText.value.trim()
    const splitByWords: number =
        totalWords === "" ? 0 : totalWords.split(" ").length

    switch (targetLanguage.value) {
        case Language.English: {
            if (splitByWords !== 0) {
                wpm.value = Math.round((splitByWords / takenTime) * 60)
            }
            if (totalWords.length !== 0) {
                cpm.value = Math.round((totalWords.length / takenTime) * 60)
            }
        }

        case Language.Korean: {
            const disassembleText: string[] = disassemble(parsingText.value)
            if (splitByWords !== 0) {
                wpm.value = Math.round((splitByWords / takenTime) * 60)
            }
            if (disassembleText.length !== 0) {
                cpm.value = Math.round(
                    (disassembleText.length / takenTime) * 60,
                )
            }
        }
    }
}

// const toggleLanguage = (lang: string) => {
//     switch (lang) {
//         case Language.Korean:
//             targetLanguage.value = Language.Korean
//             break
//         case Language.English:
//             targetLanguage.value = Language.English
//             break
//     }

//     const [currentQuote, nextQuote] = getTargetText()
//     targetText.value = currentQuote.quote
//     targetPerson.value = currentQuote.person
//     nextText.value = nextQuote.quote

//     readyText()
//     resetInfo()
// }
const toggleLanguage = (lang: Language) => {
    if (lang !== targetLanguage.value) {
        toggleLangBtn.reverse()
    }

    switch (lang) {
        case Language.Korean:
            if (lang === targetLanguage.value) return
            targetLanguage.value = Language.Korean
            break
        case Language.English:
            if (lang === targetLanguage.value) return
            targetLanguage.value = Language.English
            break
    }

    const [currentQuote, nextQuote] = getTargetText()
    targetText.value = currentQuote.quote
    targetPerson.value = currentQuote.person
    nextText.value = nextQuote.quote

    readyText()
    resetInfo()
}

// 오타 확인을 위해 문장 글자단위로 분해
const readyText = () => {
    splitedTargetText.value = targetText.value.split("")
    typoArray.value = new Array(splitedTargetText.value.length).fill(false)
}

const getTargetText = (): Quote[] => {
    let targetDatas: Quote[] = []

    switch (targetLanguage.value) {
        case Language.Korean:
            targetDatas = KrQuotes
            break
        case Language.English:
            targetDatas = EnQuotes
            break
    }

    const randomIndex: number = Math.floor(Math.random() * targetDatas.length)

    return [
        targetDatas[randomIndex],
        targetDatas[(randomIndex + 1) % targetDatas.length],
    ]
}

const getTypoClass = (index: number): string => {
    const lastIndex = Object.keys(typoStatus.value).length - 1

    if (typoStatus.value[index] === TypoStatus.NotInput) return ""
    if (typoStatus.value[index] === TypoStatus.Error) return $style.typo
    if (typoStatus.value[index] === TypoStatus.Correct) {
        if (parseInt(Object.keys(typoStatus.value)[lastIndex]) === index) {
            return `${$style.success} ${$style.lastSuccess}`
        }
        return $style.success
    }
    return ""
}

const getElapsedTime = (): string => {
    const min: number = Math.floor(elapsedTime.value / 60)
    const sec: number = elapsedTime.value % 60

    return `${min}분 ${sec}초`
}

const getActiveClass = (lang: Language): string => {
    if (lang === targetLanguage.value) {
        return $style.active
    } else {
        return ""
    }
}
</script>

<style lang="scss" module>
.index {
    width: 100%;
    min-height: 100dvh;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    transition: all 0.5s;

    > .typing {
        width: 1300px;
        height: 500px;

        display: grid;
        grid-template: repeat(8, 1fr) / repeat(10, 1fr);
        grid-template-areas:
            "i i i n . l m b b b"
            "i i i kt kt l m b b b"
            "i i i s s w c b b b"
            "i i i s s a p t t t"
            "x x x x x x x x x x"
            "x x x x x x x x x x"
            "x x x x x x x x x x"
            "x x x x x x x x x x";
        gap: 10px;

        background-color: var(--bg-secondary);
        border: 2px solid var(--border-color);
        border-radius: 10px;
        box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2);

        margin-inline: auto;
        padding: 20px;

        > .gridItem {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            background-color: var(--bg);

            border: 2px solid var(--border-color);
            border-radius: 10px;
            box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2);
        }

        > .icon {
            grid-area: i;
        }

        > .language {
            height: 100%;

            grid-area: l;

            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            align-items: center;

            > .langBtn {
                width: 80px;
                height: 40px;

                text-align: center;
                line-height: 40px;

                background-color: var(--bg-secondary);

                border: 2px solid var(--border-color);
                border-radius: 7px;
                box-shadow: 5px 5px 12px rgba(0, 0, 0, 0.2);

                cursor: pointer;

                &:active {
                    width: 50px;
                    height: 25px;
                    line-height: 25px;

                    transition: all 0.2s;
                }
            }

            > .active {
                background-color: var(--color-primary);
            }
        }

        > .screenMode {
            width: 100%;
            height: 100%;

            grid-area: m;

            background-color: var(--bg);

            display: flex;
            flex-direction: row;
        }

        > .blinkBox {
            grid-area: b;

            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            padding: 12px;
            padding-block: 30px;
        }

        > .sentence {
            grid-area: s;
        }

        > .wpm {
            grid-area: w;
        }

        > .cpm {
            grid-area: c;
        }

        > .accuracy {
            grid-area: a;
        }

        > .progress {
            grid-area: p;
        }

        > .person {
            grid-area: t;
        }

        > .count {
            grid-area: n;
        }

        > .keyTheme {
            grid-area: kt;
        }

        > .textArea {
            grid-area: x;

            display: flex;
            justify-content: center;
            align-items: center;
            padding: 30px;

            > .text {
                height: 30px;
                font-size: 20px;
                margin-right: auto;

                > span {
                    height: 100%;
                    transition-property: color;
                    transition-duration: 0.2s;
                    transition-timing-function: ease-out;
                }

                > .typo {
                    color: red;
                    background-color: aqua;
                }

                > .success {
                    color: var(--color-primary);
                }

                > .lastSuccess {
                    border-right: 1px solid var(--color-secondary);
                }
            }

            > .inputs {
                width: 100%;
                text-align: left;
                padding: 30px;

                > input {
                    width: 100%;
                    font-size: 20px;
                    color: black;

                    border: none;
                    border-bottom: 2px solid var(--border-color);
                    outline: none;

                    &::placeholder {
                        color: var(--border-color);
                    }
                }
            }

            > .nextText {
                width: 100%;
                text-align: left;
                color: var(--border-color);
            }

            > .person {
                color: #ccc;
                font-size: 18px;
                font-style: italic;
            }
        }
    }
}
</style>
