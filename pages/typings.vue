<template>
    <div :class="$style.index">
        <div :class="$style.typing">
            <div :class="[$style.icon, $style.gridItem]">로고위치</div>
            <div :class="[$style.language, $style.gridItem]">
                <div :class="$style.langToggle">
                    <div
                        :class="[
                            $style.langBtn,
                            getActiveClass(Language.korean),
                        ]"
                        @click="toggleLanguage(Language.korean)"
                    >
                        Ko
                    </div>
                    <div
                        :class="[
                            $style.langBtn,
                            getActiveClass(Language.english),
                        ]"
                        @click="toggleLanguage(Language.english)"
                    >
                        En
                    </div>
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
            <div :class="[$style.count, $style.gridItem]">카운트</div>
            <div :class="[$style.keyTheme, $style.gridItem]">키보드테마</div>
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
                        v-model="typedText"
                        type="text"
                        autofocus
                        placeholder="위에 보이는 문장을 따라 타이핑해보세요."
                        @keyup="keyupEventHandler"
                        @keydown.enter.prevent="endTyping"
                        @compositionstart="beforeCheckTypo"
                        @compositionupdate="beforeCheckTypo"
                        @compositionend="beforeCheckTypo"
                        @paste="preventPaste"
                    />
                </div>
                <div :class="$style.nextText">다음으로 나올 문장</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import * as hangul from "hangul-js"
import EnQuotes from "@/assets/LifeQuotesEN.json"
import KrQuotes from "@/assets/LifeQuotesKR.json"
import { TypoStatus, Language, type Quote } from "~/structure/quotes"

const $style = useCssModule()
const colorMode = useColorMode()
const runtime = useRuntimeConfig()

const screenColors = ["light", "dark", "sepia", "system"]

//v-memo 확인해보기
const targetPerson: Ref<string> = ref("")
const targetText: Ref<string> = ref("")
const targetLanguage: Ref<Language> = ref(Language.korean)
const splitedTargetText: Ref<string[]> = ref([])
// 유저가 타이핑한 문장
const typedText: Ref<string> = ref("")
const parsingText: Ref<string> = ref("")

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

const isTyped: Ref<boolean> = ref(false)

// 경과시간 계산 반복하는 setTimeOut Id
const elapsedTimerId: Ref<NodeJS.Timeout | undefined> = ref(undefined)

onMounted(() => {
    if (process.server) return
    // runtime.public.API
    const target: Quote = getTargetText()
    targetText.value = target.quote
    targetPerson.value = target.person
    readyText()
})

//타입캐스팅
const keyupEventHandler = (e: KeyboardEvent) => {
    console.log("백스페")
    startTyping((e.currentTarget as HTMLInputElement).value)
}

const preventPaste = (e: ClipboardEvent) => {
    e.preventDefault()
}

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
    accuracy()
    progress()
    targetLanguage.value === Language.korean ? beforeCheckTypo : checkTypo
}

// 마지막으로 타이핑한 시간 기준으로 경과시간을 계산
const currentTyping = () => {
    const date = new Date()
    lastTypingTime.value = date.getTime()
    elapsedTime.value = (lastTypingTime.value - startTime.value) / 1000
    // 경과시간을 받아 속도 계산
    calcTypingSpeed(elapsedTime.value)
}

const beforeCheckTypo = (e: CompositionEvent) => {
    if (e.type === "compositionupdate" && "compositionstart") {
        return
    } else {
        checkTypo()
    }
}

// typoArray에서 true인 i는 오타를 의미
const checkTypo = () => {
    typoStatus.value = {}

    for (let i = 0; i < parsingText.value.length; i++) {
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
const keepCheckElapsedTime = () => {
    const date = new Date()
    const currentTime: number = date.getTime()
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

    const target: Quote = getTargetText()
    targetText.value = target.quote
    targetPerson.value = target.person

    readyText()
    resetInfo()
}

const resetInfo = () => {
    stopTypingSpeedCalc()

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
        case Language.english: {
            if (splitByWords !== 0) {
                wpm.value = Math.round((splitByWords / takenTime) * 60)
            }
            if (totalWords.length !== 0) {
                cpm.value = Math.round((totalWords.length / takenTime) * 60)
            }
        }

        case Language.korean: {
            const disassembleText: string[] = hangul.disassemble(
                parsingText.value,
            )
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

const toggleLanguage = (lang: string) => {
    switch (lang) {
        case Language.korean:
            targetLanguage.value = Language.korean
            break
        case Language.english:
            targetLanguage.value = Language.english
            break
        default:
            console.log("targetLanguage.value could not be found.")
    }

    const target: Quote = getTargetText()
    targetText.value = target.quote
    targetPerson.value = target.person

    readyText()
    resetInfo()
}

// 오타 확인을 위해 문장 글자단위로 분해
const readyText = () => {
    splitedTargetText.value = targetText.value.split("")
    typoArray.value = new Array(splitedTargetText.value.length).fill(false)
}
//삼항연산자 쓰지말고 스위치 쓰기
const getTargetText = (): Quote => {
    let targetDatas: Quote[] = []
    targetLanguage.value === Language.korean
        ? (targetDatas = KrQuotes)
        : (targetDatas = EnQuotes)

    const randomIndex: number = Math.floor(Math.random() * targetDatas.length)
    return targetDatas[randomIndex]
}
//비교할거면 다 === 아니면 다 == 통일좀
const getTypoClass = (index: number): string => {
    if (typoStatus.value[index] == null) return ""
    if (typoStatus.value[index] == TypoStatus.Error) return $style.typo
    return $style.success
}

const getElapsedTime = (): string => {
    const min: number = Math.floor(elapsedTime.value / 60)
    const sec: number = elapsedTime.value % 60

    return `${min}분 ${sec}초`
}

const getActiveClass = (lang: string): string => {
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
    align-items: center;
    justify-content: center;

    flex-direction: column;

    border: 1px solid yellow;

    > .typing {
        width: 1200px;
        height: 500px;

        display: grid;
        grid-template: repeat(8, 1fr) / repeat(10, 1fr);
        grid-template-areas:
            "i i i l l m m b b b"
            "i i i l l m m b b b"
            "i i i s s w c n kt kt"
            "i i i s s a p t t t"
            "x x x x x x x x x x"
            "x x x x x x x x x x"
            "x x x x x x x x x x"
            "x x x x x x x x x x";
        gap: 10px;

        background-color: #f5f5f5;
        border: 1px solid rgb(58, 58, 60, 0.1);
        border-radius: 10px;
        box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);

        margin-inline: auto;
        padding: 20px;

        > .gridItem {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            background-color: #ffffff;

            border: 1px solid rgb(58, 58, 60, 0.09);
            border-radius: 10px;
            box-shadow: 5px 5px 12px rgba(0, 0, 0, 0.2);
        }

        > .icon {
            grid-area: i;
        }

        > .language {
            grid-area: l;

            > .langToggle {
                > .langBtn {
                    background-color: red;
                }

                > .active {
                    background-color: blue;
                }
            }
        }

        > .screenMode {
            grid-area: m;
            display: flex;
            flex-direction: row;
            background-color: var(--bg);

            > .colorPicker {
                width: 60px;
                display: block;
            }
        }

        > .blinkBox {
            grid-area: b;

            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            padding: 5px;
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
                font-size: 20px;
                margin-right: auto;

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

            > .inputs {
                width: 100%;
                text-align: left;
                padding: 30px;

                > input {
                    width: 100%;
                    font-size: 20px;
                    color: black;

                    border: none;
                    border-bottom: 2px solid #ccc;
                    outline: none;

                    &::placeholder {
                        color: #ccc; /* Change placeholder text color to gray */
                    }
                }
            }

            > .nextText {
                width: 100%;
                text-align: left;
            }
        }

        > .person {
            color: #ccc;
            font-size: 18px;
            font-style: italic;
        }
    }
}
.Space {
    width: 120px;
}
</style>
