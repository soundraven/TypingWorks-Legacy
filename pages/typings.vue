<template>
    <div :class="$style.index">
        <div :class="$style.typing">
            <div :class="[$style.typedText, $style.gridItem]" v-auto-animate>
                <div
                    :class="[$style.listBox]"
                    v-for="(typedQuote, index) in store.typedQuote"
                    :key="'quote_' + index"
                    @click="
                        switchTargetText(typedQuote.quote, typedQuote.person)
                    "
                    @mouseenter="setHoverIndex(index)"
                    @mouseleave="setHoverIndex(null)"
                >
                    <div :class="$style.list">{{ typedQuote.quote }}</div>
                    <teleport to="#targetText">
                        <div :class="$style.hoverQuote" v-if="isHovered(index)">
                            {{ typedQuote.quote }}
                        </div>
                    </teleport>
                </div>
            </div>
            <div :class="[$style.language, $style.gridItem]" v-auto-animate>
                <div
                    :class="[$style.langBtn, getActiveClass(btn)]"
                    v-for="btn in toggleLangBtn"
                    :key="btn"
                    @click="toggleLanguage(btn)"
                >
                    <div>{{ btn }}</div>
                </div>
            </div>
            <div :class="[$style.screenMode, $style.gridItem]">
                <ColorModePicker />
            </div>
            <div :class="[$style.blinkBox, $style.gridItem]">
                <TypingBlink />
            </div>
            <div :class="[$style.keyThemeName, $style.gridItem]">
                {{ getKeyThemeName() }}
            </div>
            <div :class="[$style.quoteType, $style.gridItem]" v-auto-animate>
                <div
                    :class="[$style.quoteTypeBtn, getActiveClass(btn)]"
                    v-for="btn in toggleQuoteTypeBtn"
                    :key="btn"
                    @click="toggleQuoteType(btn)"
                >
                    {{ btn }}
                </div>
            </div>
            <div :class="[$style.wpm, $style.gridItem]">WPM: {{ wpm }}</div>
            <div :class="[$style.cpm, $style.gridItem]">CPM: {{ cpm }}</div>
            <div :class="[$style.accuracy, $style.gridItem]">
                정확도: {{ accuracy }}
            </div>
            <div :class="[$style.progress, $style.gridItem]">
                진행도: {{ progress }}
            </div>
            <div :class="[$style.typingCount, $style.gridItem]">
                count: {{ typingCount }}
            </div>
            <div :class="[$style.countLimit, $style.gridItem]">
                <div
                    :class="$style.arrowBox"
                    @click="editGoalCount(Direction.Reduce)"
                >
                    <Icon
                        name="ic:baseline-arrow-circle-left"
                        :class="$style.arrow"
                    />
                </div>
                <div
                    :class="[$style.arrowBox, $style.count]"
                    v-if="goalCount !== Infinity"
                >
                    {{ goalCount }}회
                </div>
                <div :class="[$style.arrowBox, $style.infinity]" v-else>∞</div>
                <div
                    :class="$style.arrowBox"
                    @click="editGoalCount(Direction.Raise)"
                >
                    <Icon
                        name="ic:baseline-arrow-circle-right"
                        :class="$style.arrow"
                    />
                </div>
            </div>

            <div :class="[$style.keyTheme, $style.gridItem]">
                {{ getElapsedTime() }}
            </div>
            <div :class="[$style.person, $style.gridItem]">
                {{ targetPerson }}
            </div>
            <div :class="[$style.textArea, $style.gridItem]">
                <div :class="$style.targetText" id="targetText">
                    <div :class="$style.text">
                        <div
                            v-for="(char, index) in splitedTargetText"
                            :key="index"
                            :class="[getTypoClass(index), getLastTyped(index)]"
                        >
                            {{ char }}
                        </div>
                    </div>
                </div>
                <div :class="$style.inputs">
                    <input
                        v-on:input="
                            ($event) => {
                                updateTypedText($event), handleDeletion($event)
                            }
                        "
                        v-bind:value="typedText"
                        type="text"
                        autofocus
                        placeholder="위에 보이는 문장을 따라 타이핑해보세요."
                        spellcheck="false"
                        @keyup="keyupEventHandler"
                        @keydown.enter.prevent="endTyping"
                        @paste="preventPaste"
                    />
                </div>
                <div :class="$style.nextText">{{ nextText }}</div>
            </div>
        </div>
        <ResultWindow
            v-if="showResult"
            :class="$style.resultWindow"
            :typingInfo="typingInfo"
            @closeResult="finishCycle"
        />
    </div>
</template>

<script setup lang="ts">
import { disassemble } from "hangul-js"
import {
    TypoStatus,
    Language,
    Direction,
    type Quote,
    QuoteType,
    type TypingInfo,
} from "~/structure/quotes"
import { ThemeColor } from "~/structure/theme"

import EnQuotes from "@/assets/quotes/quotesEn.json"
import KoQuotes from "@/assets/quotes/quotesKo.json"
import EnPangram from "@/assets/quotes/pangramEn.json"
import KoPangram from "@/assets/quotes/pangramKo.json"

import { vAutoAnimate } from "@formkit/auto-animate"
import { useTypedQuote } from "~/store/typedQuote"

const $style = useCssModule()
const store = useTypedQuote()
const colorMode = useColorMode()

const targetPerson: Ref<string> = ref("")
const targetText: Ref<string> = ref("")
const nextPerson: Ref<string> = ref("")
const nextText: Ref<string> = ref("")
const targetLanguage: Ref<Language> = ref(Language.Korean)
const toggleLangBtn: Ref<Language[]> = ref([Language.Korean, Language.English])
const targetQuoteType: Ref<QuoteType> = ref(QuoteType.LifeQuote)
const toggleQuoteTypeBtn: Ref<QuoteType[]> = ref([
    QuoteType.LifeQuote,
    QuoteType.Pangram,
])

const splitedTargetText: Ref<string[]> = ref([])

const typingCount: Ref<number> = ref(0)
const goalCount: Ref<number> = ref(5)
const oneCycle: number = 5
const minCycle: number = 1
const maxCycle: number = 15

// 유저가 타이핑한 문장
const typedText: Ref<string> = ref("")
const parsingText: Ref<string> = ref("")

// 문장 입력 상태 혹은 틀림/맞음 체크
const typoStatus: Ref<TypoStatus[]> = ref([])
const checkTypoArray: Ref<TypoStatus[]> = ref([])

const accuracy: Ref<number> = ref(0)
const progress: Ref<number> = ref(0)
const wpm: Ref<number> = ref(0)
const cpm: Ref<number> = ref(0)
const avgWpm: Ref<number> = ref(0)
const avgCpm: Ref<number> = ref(0)
const maxWpm: Ref<number> = ref(0)
const maxCpm: Ref<number> = ref(0)
const avgAccuracy: Ref<number> = ref(0)
const avgProgress: Ref<number> = ref(0)
const entireElapsedtime: Ref<number> = ref(0)

const wpmArray: Ref<number[]> = ref([])
const cpmArray: Ref<number[]> = ref([])
const accuracyArray: Ref<number[]> = ref([])
const progressArray: Ref<number[]> = ref([])
const ElapsedTimeArray: Ref<number[]> = ref([])

const typingInfo: TypingInfo = reactive({
    targetLanguage: targetLanguage,
    targetQuoteType: targetQuoteType,
    avgWpm: avgWpm,
    avgCpm: avgCpm,
    maxWpm: maxWpm,
    maxCpm: maxCpm,
    avgAccuracy: avgAccuracy,
    avgProgress: avgProgress,
    count: typingCount,
    entireElapsedtime: entireElapsedtime,
})
const showResult: Ref<boolean> = ref(false)

const hoverIndex: Ref<number | null> = ref(null)

const setHoverIndex = (index) => {
    hoverIndex.value = index
}

const isHovered = (index) => {
    if (index !== null) {
        return hoverIndex.value === index
    }
    return
}

const startTime: Ref<number> = ref(0)
// 현재 경과시간만 초로 나오고 나머지는 타임스탬프 형식
const elapsedTime: Ref<number> = ref(0)
const endTime: Ref<number> = ref(0)
const totalTime: Ref<number> = ref(0)

// 경과시간 계산 반복하는 setTimeOut Id
const elapsedTimerId: Ref<NodeJS.Timeout | undefined> = ref(undefined)

onMounted(() => {
    if (process.server) return //서버사이드렌더링

    const [currentQuote, nextQuote]: Quote[] = getTargetText()

    targetText.value = currentQuote.quote
    targetPerson.value = currentQuote.person
    nextText.value = nextQuote.quote

    splitText()
    updateTypoStatus()
})

onBeforeUnmount(() => {
    stopTypingSpeedCalc()
})

const editGoalCount = (direction: Direction) => {
    //한 사이클당 문장 몇 회 타이핑할지 선택
    switch (direction) {
        case Direction.Raise:
            if (goalCount.value === maxCycle) {
                goalCount.value = Infinity
            } else if (goalCount.value === minCycle) {
                goalCount.value = oneCycle
            } else {
                goalCount.value += oneCycle
            }
            break
        case Direction.Reduce:
            if (goalCount.value === Infinity) {
                goalCount.value = maxCycle
            } else if (goalCount.value > oneCycle) {
                goalCount.value -= oneCycle
            } else {
                goalCount.value = minCycle
            }
            break
    }
}

const keyupEventHandler = (e: KeyboardEvent) => {
    if (e.code === "Enter") return

    startTyping((e.currentTarget as HTMLInputElement).value)
}

const preventPaste = (e: ClipboardEvent) => {
    e.preventDefault()
}

const updateTypedText = (e) => {
    typedText.value = (e.target as HTMLInputElement).value
}

const startTyping = (text: string) => {
    parsingText.value = text

    if (startTime.value === 0) {
        if (text === "") return

        const date = new Date()
        startTime.value = date.getTime()

        startTypingSpeedCalc()
    }

    calcAccuracy()
    calcProgress()
}

// 오타 확인을 위해 문장 글자단위로 분해
const splitText = () => {
    splitedTargetText.value = targetText.value.split("")
}

const updateTypoStatus = () => {
    typoStatus.value = new Array(splitedTargetText.value.length).fill(
        TypoStatus.NotInput,
    )
}

//백스페이스 및 글자 제거 기능 사용시 오타 체크
const handleDeletion = (e: Event) => {
    const inputEvent = e as InputEvent

    const deleteTypes = [
        "deleteContentBackward",
        "deleteContentForward",
        "deleteByCut",
        "deleteByDrag",
    ]

    if (deleteTypes.includes(inputEvent.inputType)) {
        refillTypoArrays()
    }
}

const refillTypoArrays = () => {
    const splitedParsingText: string[] = parsingText.value.split("")

    checkTypoArray.value = []
    parsingText.value = typedText.value

    for (let i = 0; i < parsingText.value.length; i++) {
        if (typeof targetText.value[i] === "undefined") continue

        if (targetText.value[i] === splitedParsingText[i]) {
            checkTypoArray.value[i] = TypoStatus.Correct
        } else {
            checkTypoArray.value[i] = TypoStatus.Error
        }
    }

    for (let i = 0; i < typoStatus.value.length; i++) {
        //Typo 클래스 부여는 typoStatus가 하기때문에 동기화 필요
        if (typoStatus.value[i] !== checkTypoArray.value[i]) {
            typoStatus.value[i] = checkTypoArray.value[i]
        }
    }
}

const checkTypo = () => {
    const splitedParsingText: string[] = parsingText.value.split("")

    for (let i = 0; i + 1 < parsingText.value.length; i++) {
        //오타 관리 배열에 TypoStatus 채우기
        if (splitedParsingText[i] === undefined) {
            typoStatus.value[i] = TypoStatus.NotInput
        }

        if (targetText.value[i] === splitedParsingText[i]) {
            typoStatus.value[i] = TypoStatus.Correct //한박자 늦게 따라오는 오타 체크 배열 - 조합문자 이슈
        } else {
            typoStatus.value[i] = TypoStatus.Error
        }
    }

    for (let i = 0; i < parsingText.value.length; i++) {
        if (targetText.value[i] === undefined) continue
        if (targetText.value[i] === splitedParsingText[i]) {
            checkTypoArray.value[i] = TypoStatus.Correct //입력받는대로 따라오는 오타 체크 배열
        } else {
            checkTypoArray.value[i] = TypoStatus.Error
        }
    }
}

const getTypoClass = (index: number): string => {
    //오타와 정타에 클래스 부여
    if (typoStatus.value[index] === TypoStatus.NotInput) return ""
    if (typoStatus.value[index] === TypoStatus.Error) return $style.typo
    if (typoStatus.value[index] === TypoStatus.Correct) return $style.success

    return ""
}

const getLastTyped = (index: number): string | string[] => {
    const splitedParsingText: string[] = parsingText.value.split("")
    const lastIndex: number = splitedParsingText.length - 1

    const hangulRange = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/ // 한글 자음 모음과 조합 문자의 유니코드 범위
    const combiningRange = /[\u0300-\u036F]/

    if (
        (lastIndex === index &&
            // 마지막 입력이 한글이나 조합 문자일 경우 클래스를 적용하지 않음
            hangulRange.test(parsingText.value[lastIndex])) ||
        combiningRange.test(parsingText.value[lastIndex])
    ) {
        return $style.lastTyped
    } else if (lastIndex === index) {
        switch (checkTypoArray.value[index]) {
            case TypoStatus.Correct:
                return [$style.success, $style.lastTyped]
            case TypoStatus.Error:
                return [$style.typo, $style.lastTyped]
            default:
                return $style.lastTyped
        }
    } else {
        return ""
    }
}

const calcAccuracy = () => {
    const typoCount: number = typoStatus.value.filter(
        (value: TypoStatus) => value === TypoStatus.Error,
    ).length

    accuracy.value = getPercentage(
        typoStatus.value.length - typoCount,
        typoStatus.value.length,
    )
}

const calcProgress = () => {
    progress.value = getPercentage(
        parsingText.value.split("").length,
        targetText.value.split("").length,
    )
}

const startTypingSpeedCalc = () => {
    elapsedTimerId.value = setInterval(keepCheckElapsedTime, 100)
}

const keepCheckElapsedTime = () => {
    const date = new Date()
    const currentTime: number = date.getTime()

    elapsedTime.value = Math.floor((currentTime - startTime.value) / 1000)

    calcTypingSpeed(elapsedTime.value)
}

const stopTypingSpeedCalc = () => {
    clearInterval(elapsedTimerId.value)
}

const pushCalculatedArray = () => {
    wpmArray.value.push(wpm.value)
    cpmArray.value.push(cpm.value)
    accuracyArray.value.push(accuracy.value)
    progressArray.value.push(progress.value)
    ElapsedTimeArray.value.push(elapsedTime.value)
}
const getAvgValue = (array: number[]) => {
    const avg = Math.floor(
        array.reduce((acc, cur) => acc + cur, 0) / array.length,
    )
    return avg
}
const calcTypingInfo = () => {
    avgWpm.value = getAvgValue(wpmArray.value)
    avgCpm.value = getAvgValue(cpmArray.value)
    avgAccuracy.value = getAvgValue(accuracyArray.value)
    avgProgress.value = getAvgValue(progressArray.value)

    entireElapsedtime.value = ElapsedTimeArray.value.reduce(
        (acc, cur) => acc + cur,
    )

    typingInfo.maxWpm = Math.max(...wpmArray.value)
    typingInfo.maxCpm = Math.max(...cpmArray.value)
    typingInfo.avgWpm = avgWpm.value
    typingInfo.avgCpm = avgCpm.value
    typingInfo.avgAccuracy = avgAccuracy.value
    typingInfo.avgProgress = avgProgress.value
    typingInfo.entireElapsedtime = entireElapsedtime.value
}

const readyQuote = () => {
    const [nextTarget] = getTargetText()

    targetText.value = nextText.value
    targetPerson.value = nextPerson.value
    nextText.value = nextTarget.quote
    nextPerson.value = nextTarget.person
}

const endTyping = () => {
    if (showResult.value) return

    stopTypingSpeedCalc()

    typingCount.value++
    store.addList(targetText.value, targetPerson.value)
    pushCalculatedArray()

    const date = new Date()
    endTime.value = date.getTime()
    totalTime.value = (endTime.value - startTime.value) / 1000

    calcTypingSpeed(totalTime.value)
    calcTypingInfo()

    if (typingCount.value >= goalCount.value) {
        toggleShow()
        return
    }

    readyQuote()
    splitText()
    updateTypoStatus()
    resetInfo()
}

const resetInfo = () => {
    typedText.value = ""
    parsingText.value = ""
    startTime.value = 0
    elapsedTime.value = 0
    clearInterval(elapsedTimerId.value)
    elapsedTimerId.value = undefined

    wpm.value = 0
    cpm.value = 0
    accuracy.value = 0
    progress.value = 0

    typoStatus.value = []
}

const finishCycle = () => {
    resetInfo()

    avgWpm.value = 0
    avgCpm.value = 0
    maxWpm.value = 0
    maxCpm.value = 0
    avgAccuracy.value = 0
    avgProgress.value = 0
    entireElapsedtime.value = 0

    wpmArray.value = []
    cpmArray.value = []
    accuracyArray.value = []
    progressArray.value = []
    ElapsedTimeArray.value = []

    typingCount.value = 0

    toggleShow()
}

const calcTypingSpeed = (takenTime: number) => {
    if (takenTime === 0) return

    const totalWords: string = parsingText.value.trim()
    const splitByWords: number =
        totalWords === "" ? 0 : totalWords.split(" ").length

    switch (targetLanguage.value) {
        case Language.English: {
            wpm.value = calcSpeed(splitByWords, takenTime)
            cpm.value = calcSpeed(totalWords.length, takenTime)
        }

        case Language.Korean: {
            const disassembleText: string[] = disassemble(parsingText.value)

            wpm.value = calcSpeed(splitByWords, takenTime)
            cpm.value = calcSpeed(disassembleText.length, takenTime)
        }
    }
}

const toggleLanguage = (lang: Language) => {
    if (lang !== targetLanguage.value) {
        toggleLangBtn.value.reverse()
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

    splitText()
    resetInfo()
}

const toggleQuoteType = (type: QuoteType) => {
    if (type !== targetQuoteType.value) {
        toggleQuoteTypeBtn.value.reverse()
    }

    switch (type) {
        case QuoteType.LifeQuote:
            if (type === targetQuoteType.value) return
            targetQuoteType.value = QuoteType.LifeQuote
            break

        case QuoteType.Pangram:
            if (type === targetQuoteType.value) return
            targetQuoteType.value = QuoteType.Pangram
            break
    }

    const [currentQuote, nextQuote] = getTargetText()
    targetText.value = currentQuote.quote
    targetPerson.value = currentQuote.person
    nextText.value = nextQuote.quote

    splitText()
    resetInfo()
}

const getTargetText = (): Quote[] => {
    let targetDatas: Quote[] = []

    const category = {
        [Language.Korean]: {
            [QuoteType.LifeQuote]: KoQuotes,
            [QuoteType.Pangram]: KoPangram,
        },
        [Language.English]: {
            [QuoteType.LifeQuote]: EnQuotes,
            [QuoteType.Pangram]: EnPangram,
        },
    }

    targetDatas =
        (category[targetLanguage.value] &&
            category[targetLanguage.value][targetQuoteType.value]) ||
        KoQuotes

    const randomIndex: number = Math.floor(Math.random() * targetDatas.length)

    return [
        targetDatas[randomIndex],
        targetDatas[(randomIndex + 1) % targetDatas.length],
    ]
}

const getElapsedTime = (): string => {
    if (elapsedTime.value === 0) {
        return `${0}분 ${0}초`
    }

    const min: number = Math.floor(elapsedTime.value / 60)
    const sec: number = elapsedTime.value % 60

    return `${min}분 ${sec}초`
}

const getActiveClass = (lang: Language | QuoteType): string => {
    if (lang === targetLanguage.value || lang === targetQuoteType.value) {
        return $style.active
    } else {
        return ""
    }
}

watch(parsingText, (newValue) => {
    if (newValue === "") {
        resetInfo()
        refillTypoArrays()
    }

    checkTypo()
})

const toggleShow = () => {
    showResult.value = !showResult.value
}

const switchTargetText = (quote: string, person: string) => {
    targetText.value = quote
    targetPerson.value = person

    splitText()
    updateTypoStatus()
}

const getKeyThemeName = () => {
    switch (colorMode.preference) {
        case ThemeColor.Light:
            return "Modern Dolch"

        case ThemeColor.Dark:
            return "Dolch"

        case ThemeColor.Sepia:
            return "Soyamilk"

        case ThemeColor.System:
            let systemMode: boolean | null = null

            if (process.client) {
                systemMode = window.matchMedia(
                    "(prefers-color-scheme: light)",
                ).matches
            } else return ""

            if ((systemMode = null)) return ""
            return systemMode ? "Modern Dolch" : "Dolch"
    }
}
</script>

<style lang="scss" module>
@keyframes flash-border {
    0% {
        border-right-color: var(--color-secondary);
    }
    50% {
        border-right-color: transparent;
    }
    100% {
        border-right-color: var(--color-secondary);
    }
}

@keyframes flash-box-shadow {
    0% {
        box-shadow:
            inset 0px 0px 30px var(--color-primary-shadow-inset-start),
            0px 0px 35px var(--color-primary-shadow-start);
    }
    50% {
        box-shadow:
            inset 0px 0px 30px var(--color-primary-shadow-inset-mid),
            0px 0px 35px var(--color-primary-shadow-mid);
    }

    75% {
        box-shadow-inset: 0px 0px 30px var(--color-primary-shadow-inset-mid);
    }
    100% {
        box-shadow: none;
    }
}

@keyframes shake {
    0% {
        transform: translateY(0);
    }
    25% {
        transform: translateY(-2px);
    }
    75% {
        transform: translateY(2px);
    }
    100% {
        transform: translateY(0);
    }
}

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
            "i i i n nl a m b b b"
            "i i i w c p m b b b"
            "i i i kt kt q l b b b"
            "i i i t t q l tn tn tn"
            "x x x x x x x x x x"
            "x x x x x x x x x x"
            "x x x x x x x x x x"
            "x x x x x x x x x x";
        gap: 10px;

        background-color: var(--bg-secondary);
        border: 2px solid var(--border-color);
        border-radius: 10px;
        box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.15);

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
            box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.15);
        }

        > .typedText {
            grid-area: i;

            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-end;

            font-size: 16px;

            padding-block: 4.5px;

            overflow: hidden;

            > .listBox {
                width: 340px;
                height: 33px;

                display: flex;
                align-items: center;
                justify-content: center;

                border: 2px solid var(--border-color);
                border-radius: 10px;

                margin-block: 4.5px;

                animation: flash-box-shadow 1s;

                position: relative;

                &:hover {
                    cursor: pointer;
                }

                > .list {
                    width: 100%;
                    height: 100%;

                    text-align: left;
                    line-height: 33px;

                    text-overflow: ellipsis;
                    white-space: nowrap;
                    word-break: break-all;

                    overflow: hidden;

                    border-radius: 10px;
                    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.15);

                    padding-inline: 5px;
                }
            }
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

                position: relative;

                text-align: center;
                line-height: 40px;

                background-color: var(--bg-secondary);

                border: 2px solid var(--border-color);
                border-radius: 7px;
                box-shadow: 5px 5px 12px rgba(0, 0, 0, 0.15);

                transition:
                    width 0.2s,
                    height 0.2s,
                    font-size 0.2s,
                    line-height 0.2s;

                &:hover {
                    cursor: pointer;
                    top: -3px;
                }

                &:active {
                    width: 50px;
                    height: 25px;
                    font-size: 9px;
                    line-height: 25px;
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

        > .keyThemeName {
            grid-area: tn;
            text-align: center;
            line-height: 100%;
        }

        > .quoteType {
            grid-area: q;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;

            > .quoteTypeBtn {
                width: 80px;
                height: 40px;

                position: relative;
                display: inline-block;

                text-align: center;
                line-height: 40px;

                background-color: var(--bg-secondary);

                border: 2px solid var(--border-color);
                border-radius: 7px;
                box-shadow: 5px 5px 12px rgba(0, 0, 0, 0.15);

                transition:
                    width 0.2s,
                    height 0.2s,
                    font-size 0.2s,
                    line-height 0.2s;

                &:hover {
                    cursor: pointer;
                    top: -3px;
                }

                &:active {
                    width: 50px;
                    height: 25px;
                    font-size: 9px;
                    line-height: 25px;
                }
            }

            > .active {
                background-color: var(--color-primary);
            }
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

        > .typingCount {
            grid-area: n;
        }

        > .countLimit {
            grid-area: nl;

            display: flex;
            flex-direction: row;
            justify-content: space-around;
            align-items: center;

            > .arrowBox {
                width: 30px;
                height: 30px;

                display: flex;
                justify-content: center;
                align-items: center;

                > .arrow {
                    width: 27px;
                    height: 27px;

                    color: var(--color-secondary);
                    line-height: 27px;

                    position: relative;

                    transition-duration: 0.2s;

                    &:hover {
                        cursor: pointer;
                    }

                    &:active {
                        width: 22px;
                        height: 22px;

                        color: var(--color-primary);
                        transition-duration: 0s;
                    }
                }
            }

            > .count {
                width: 40px;
                height: 40px;
            }

            > .infinity {
                font-size: 27px;
            }
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

            > .targetText {
                width: 100%;
                height: 100%;
                position: relative;
                margin-right: auto;

                > .text {
                    height: 30px;

                    display: flex;

                    font-size: 20px;
                    line-height: 30px;

                    margin-right: auto;

                    > div {
                        min-width: 7px;
                        transition-property: color;
                        transition-duration: 0.2s;
                        transition-timing-function: ease-out;
                        position: relative;
                    }

                    > .typo {
                        color: rgb(255, 0, 0, 0.8);
                        animation: shake 0.2s;
                    }

                    > .success {
                        color: var(--color-primary);
                    }

                    > .lastTyped {
                        animation: flash-box-shadow 1s;
                    }

                    > .lastTyped::after {
                        content: "";
                        height: 80%;

                        border-right: 2px solid var(--color-secondary);

                        animation: flash-border 1.2s infinite;

                        position: absolute;
                        right: -1px;
                        top: 50%;
                        transform: translateY(-50%);
                    }
                }
            }

            > .inputs {
                width: 100%;
                text-align: left;
                padding: 30px;

                > input {
                    width: 100%;

                    background-color: var(--bg);

                    font-size: 20px;
                    color: var(--color-secondary);

                    border: none;
                    border-bottom: 2px solid var(--border-color);
                    outline: none;

                    padding-bottom: 5px;

                    &::placeholder {
                        color: var(--border-color);
                    }

                    &:focus {
                        border-bottom-color: var(--color-primary);
                        box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.08);
                    }
                }
            }

            > .nextText {
                width: 100%;
                text-align: left;
                color: var(--border-color);
            }

            > .person {
                color: var(--color-secondary);
                font-size: 18px;
                font-style: italic;
            }
        }
    }
}

.hoverQuote {
    width: 100%;
    height: 30px;

    font-size: 20px;
    line-height: 30px;

    background-color: var(--bg);

    position: absolute;
    left: 0;
    top: 0;
    z-index: 1000;

    animation: flash-box-shadow 0.5s;
}
</style>
