<template>
  <div :class="$style.index">
    <div :class="$style.topMenu">
      <div
        v-if="$indexStore.user().user.isAuthenticated"
        :class="$style.nickname"
      >
        <el-icon><user /></el-icon>
        <el-dropdown>
          <span :class="$style.loginUserName">
            {{ $indexStore.user().user.nickname }} 님
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="navigateTo('/auth/mypage')">
                마이페이지
              </el-dropdown-item>
              <el-dropdown-item divided @click="$indexStore.user().logout">
                로그아웃
              </el-dropdown-item>
              <el-dropdown-item
                divided
                v-if="$indexStore.user().user.id === ADMIN_ID"
                @click="navigateTo('/auth/admin')"
              >
                관리자 페이지
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div v-else :class="$style.nickname" @click="openSidebar">
        <el-icon><user /></el-icon>Guest
      </div>
      <div :class="$style.menuContainer">
        <span @click="openSidebar" :class="$style.menu">
          <el-icon><Setting /></el-icon>&nbsp;Setting
        </span>
        <span @click="navigateTo('/typing/request')" :class="$style.menu">
          <el-icon> <document-add /> </el-icon>&nbsp;Request
        </span>
      </div>
    </div>
    <div :class="$style.typing">
      <div :class="[$style.typedText, $style.gridItem]" v-auto-animate>
        <div
          :class="[$style.listBox]"
          v-for="(typedSentence, index) in $indexStore.typing()
            .typedSentenceList"
          :key="'quote_' + index"
        >
          <div :class="$style.list">{{ typedSentence.content }}</div>
        </div>
      </div>
      <div :class="[$style.language, $style.gridItem]">
        {{ targetSentence.language === "kr" ? "Korean" : "English" }}
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
      <div :class="[$style.sentenceType, $style.gridItem]">
        {{ targetSentence.type }}
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
        count: {{ $indexStore.typing().typingInfo.count }}
      </div>
      <div :class="[$style.countLimit, $style.gridItem]">
        <div :class="$style.arrowBox" @click="editGoalCount(Direction.Reduce)">
          <Icon name="ic:baseline-arrow-circle-left" :class="$style.arrow" />
        </div>
        <div :class="[$style.arrowBox, $style.count]">{{ oneCycle }}회</div>
        <div :class="$style.arrowBox" @click="editGoalCount(Direction.Raise)">
          <Icon name="ic:baseline-arrow-circle-right" :class="$style.arrow" />
        </div>
      </div>

      <div :class="[$style.keyTheme, $style.gridItem]">
        {{ getElapsedTime(elapsedTime) }}
      </div>
      <div :class="[$style.person, $style.gridItem]">
        {{ targetSentence.source }}
      </div>
      <div :class="[$style.textArea, $style.gridItem]">
        <div :class="$style.targetSentence">
          <div :class="$style.text">
            <div
              v-for="(char, index) in splitedtargetSentence"
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
        <div :class="$style.nextSentence">{{ nextSentence.content }}</div>
      </div>
    </div>
    <ResultWindow
      v-if="showResult"
      :class="$style.resultWindow"
      :typingInfo="$indexStore.typing().typingInfo"
      @closeResult="finishCycle"
    />
  </div>
  <div>
    <el-button @click="openSidebar">사이드바</el-button>
  </div>
  <Sidebar
    ref="sidebar"
    v-model:selectedLanguage="targetLanguage"
    v-model:selectedSentenceType="targetSentenceType"
    @triggerReadySentence="readySentence"
  />
</template>

<script setup lang="ts">
import { disassemble } from "hangul-js"
import { ThemeColor } from "@/types/theme"
import { vAutoAnimate } from "@formkit/auto-animate"
import { TypoStatus, type Sentence, Direction } from "~/types/typing"
import Sidebar from "~/components/Sidebar.vue"
import { calcAccuracy, calcSpeed, getElapsedTime } from "~/utils/number"
import { getSentence } from "~/services/typing"
import { navigateTo } from "nuxt/app"

const { $indexStore } = useNuxtApp()

const config = useRuntimeConfig()
const ADMIN_ID = Number(config.public.ADMIN_ID)

const $style = useCssModule()
const colorMode = useColorMode()

const sidebar: Ref<InstanceType<typeof Sidebar> | null> = ref(null)

const openSidebar = () => {
  sidebar.value?.openSidebar()
}

const targetSentence: Ref<Sentence> = ref({
  id: 0,
  content: "",
  source: "",
  language: "",
  type: "",
})
const nextSentence: Ref<Sentence> = ref({
  id: 0,
  content: "",
  source: "",
  language: "",
  type: "",
})

const targetLanguage: Ref<string> = ref("kr")
const targetSentenceType: Ref<string> = ref("quote")

const splitedtargetSentence: Ref<string[]> = ref([])

const oneCycle: Ref<number> = ref(5)

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

const wpmArray: Ref<number[]> = ref([])
const cpmArray: Ref<number[]> = ref([])
const accuracyArray: Ref<number[]> = ref([])
const progressArray: Ref<number[]> = ref([])
const ElapsedTimeArray: Ref<number[]> = ref([])

const showResult: Ref<boolean> = ref(false)

const startTime: Ref<number> = ref(0)
// 현재 경과시간만 초로 나오고 나머지는 타임스탬프 형식
const elapsedTime: Ref<number> = ref(0)
const endTime: Ref<number> = ref(0)
const totalTime: Ref<number> = ref(0)

// 경과시간 계산 반복하는 setTimeOut Id
const elapsedTimerId: Ref<NodeJS.Timeout | undefined> = ref(undefined)

//한 사이클의 문장을 저장하는 배열
const oneCycleSentence: Ref<Sentence[] | undefined> = ref(undefined)

onMounted(async () => {
  if (process.server) return

  $indexStore.sentenceInfo().getSentenceInfo()

  readySentence()
})

onBeforeUnmount(() => {
  stopTypingSpeedCalc()
})

const readySentence = async (): Promise<void> => {
  oneCycleSentence.value = await getSentence(
    oneCycle.value,
    targetLanguage.value,
    targetSentenceType.value,
  )

  $indexStore
    .typing()
    .setLanguageAndType(targetLanguage.value, targetSentenceType.value)

  shiftSentence()
}

const shiftSentence = () => {
  if (oneCycleSentence.value) {
    const shiftedSentence: Sentence | undefined = oneCycleSentence.value.shift()
    const secondSentence = oneCycleSentence.value
      ? oneCycleSentence.value[0]
      : null

    if (shiftedSentence) {
      targetSentence.value = shiftedSentence
    }

    if (secondSentence) {
      nextSentence.value = secondSentence
    } else {
      nextSentence.value = {
        id: 0,
        content: "",
        source: "",
        language: "",
        type: "",
      }
    }

    splitText()
    updateTypoStatus()
  }
}

const editGoalCount = (direction: Direction) => {
  if (direction === "raise") {
    ++oneCycle.value
    $indexStore.typing().resetTypingInfo()
    readySentence()
  } else {
    if (oneCycle.value <= 1) return
    --oneCycle.value
    $indexStore.typing().resetTypingInfo()
    readySentence()
  }
}

const keyupEventHandler = (e: KeyboardEvent) => {
  if (e.code === "Enter") return

  startTyping((e.currentTarget as HTMLInputElement).value)
}

const preventPaste = (e: ClipboardEvent) => {
  e.preventDefault()
}

const updateTypedText = (e: any) => {
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

  accuracy.value = calcAccuracy(typoStatus.value)
  progress.value = calcProgress(parsingText.value, targetSentence.value.content)
}

// 오타 확인을 위해 문장 글자단위로 분해
const splitText = () => {
  splitedtargetSentence.value = targetSentence.value.content.split("")
}

const updateTypoStatus = () => {
  typoStatus.value = new Array(splitedtargetSentence.value.length).fill(
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
    if (typeof targetSentence.value.content[i] === "undefined") continue

    if (targetSentence.value.content[i] === splitedParsingText[i]) {
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

    if (targetSentence.value.content[i] === splitedParsingText[i]) {
      typoStatus.value[i] = TypoStatus.Correct //한박자 늦게 따라오는 오타 체크 배열 - 조합문자 이슈
    } else {
      typoStatus.value[i] = TypoStatus.Error
    }
  }

  for (let i = 0; i < parsingText.value.length; i++) {
    if (targetSentence.value.content[i] === undefined) continue
    if (targetSentence.value.content[i] === splitedParsingText[i]) {
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

const endTyping = () => {
  if (showResult.value) return

  stopTypingSpeedCalc()

  $indexStore.typing().countUp()
  $indexStore.typing().setTypedList(targetSentence.value)
  pushCalculatedArray()

  const date = new Date()
  endTime.value = date.getTime()
  totalTime.value = (endTime.value - startTime.value) / 1000

  calcTypingSpeed(totalTime.value)

  const charCount: number = targetSentence.value.content.replace(
    /\s+/g,
    "",
  ).length

  $indexStore
    .typing()
    .updateTypingInfo(
      wpmArray.value,
      cpmArray.value,
      accuracyArray.value,
      progressArray.value,
      ElapsedTimeArray.value,
      charCount,
    )

  shiftSentence()
  resetInfo()

  if ($indexStore.typing().typingInfo.count >= oneCycle.value) {
    toggleShow()

    document.querySelectorAll("input").forEach((input) => {
      ;(input as HTMLElement).blur()
    })

    return
  }
}

const resetInfo = (): void => {
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

const resetArray = (): void => {
  wpmArray.value = []
  cpmArray.value = []
  accuracyArray.value = []
  progressArray.value = []
  ElapsedTimeArray.value = []
}

const finishCycle = (): void => {
  console.log("finishCycle 진입")
  resetArray()
  $indexStore.typing().insertTypingInfo()
  toggleShow()
  readySentence()

  const inputElement = document.querySelector("input")
  inputElement?.focus()
}

const pipe =
  (...fns) =>
  (init) =>
    fns.reduce((acc, fn) => fn(acc), init)
const go = (init, ...fns) => pipe(...fns)(init)

const extractWordLength = (text): number => {
  return text === "" ? 0 : text.split(" ").length
}

const disassembleText = (text): string[] => disassemble(text)

const setWpm = (value): void => (wpm.value = value)
const setCpm = (value): void => (cpm.value = value)

const calcTypingSpeed = (takenTime: number) => {
  if (takenTime === 0) return

  go(
    parsingText.value.trim(),

    //영어-한글 여부에 따른 분기
    (text) => ({
      text,
      language: targetLanguage.value,
    }),

    //언어별 분석 방법 적용
    ({ text, language }) => {
      const wordLength = extractWordLength(text)
      switch (language) {
        case "en":
          return {
            wpm: calcSpeed(wordLength, takenTime),
            cpm: calcSpeed(text.length, takenTime),
          }
        case "kr": {
          const disassembled = disassembleText(text)
          return {
            wpm: calcSpeed(wordLength, takenTime),
            cpm: calcSpeed(disassembled.length, takenTime),
          }
        }
        default:
          return { wpm: 0, cpm: 0 }
      }
    },

    //결과물을 상태에 반영
    ({ wpm, cpm }) => {
      setWpm(wpm), setCpm(cpm)
      return { wpm, cpm }
    },
  )
}

// const calcTypingSpeed = (takenTime: number): void => {
//   if (takenTime === 0) return

//   const totalWords: string = parsingText.value.trim()
//   const splitByWords: number =
//     totalWords === "" ? 0 : totalWords.split(" ").length

//   switch (targetSentence.value.language) {
//     case "en": {
//       wpm.value = calcSpeed(splitByWords, takenTime)
//       cpm.value = calcSpeed(totalWords.length, takenTime)
//     }

//     case "kr": {
//       const disassembleText: string[] = disassemble(parsingText.value)

//       wpm.value = calcSpeed(splitByWords, takenTime)
//       cpm.value = calcSpeed(disassembleText.length, takenTime)
//     }
//   }
// }

watch(parsingText, (newValue) => {
  if (newValue === "") {
    resetInfo()
    refillTypoArrays()
  }

  checkTypo()
})

const toggleShow = (): void => {
  showResult.value = !showResult.value
}

const getKeyThemeName = (): string => {
  let systemMode: boolean = false

  switch (colorMode.preference) {
    case ThemeColor.Light:
      return "Modern Dolch"

    case ThemeColor.Dark:
      return "Dolch"

    case ThemeColor.Sepia:
      return "Soyamilk"

    case ThemeColor.System:
      systemMode = true

      if (process.client) {
        systemMode = window.matchMedia("(prefers-color-scheme: light)").matches

        return systemMode ? "Modern Dolch" : "Dolch"
      } else {
        return ""
      }

    default:
      return ""
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
  width: 1340px;
  height: 100dvh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  margin-inline: auto;

  transition: all 0.5s;

  > .topMenu {
    width: 100%;
    height: 24px;

    display: flex;
    align-items: center;
    justify-content: space-between;
    align-content: center;

    font-size: 18px;
    text-align: center;

    margin-bottom: 6px;

    > .nickname {
      display: flex;
      align-items: center;
      gap: 6px;

      &:hover {
        cursor: pointer;
      }

      .loginUserName {
        font-size: 18px;
        color: var(--color);
      }
    }

    > .menuContainer {
      display: flex;
      gap: 6px;

      &:hover {
        cursor: pointer;
      }

      > .menu {
        display: flex;
        align-items: center;
      }
    }
  }

  > .typing {
    width: 1300px;
    height: 500px;

    display: grid;
    grid-template: repeat(8, 1fr) / repeat(10, 1fr);
    grid-template-areas:
      "i i i n nl a m b b b"
      "i i i w c p m b b b"
      "i i i kt kt l l b b b"
      "i i i t t q q tn tn tn"
      "x x x x x x x x x x"
      "x x x x x x x x x x"
      "x x x x x x x x x x"
      "x x x x x x x x x x";
    gap: 10px;

    background-color: var(--bg-secondary);
    border: 2px solid var(--border-color);
    border-radius: 10px;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.15);

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
        width: 100%;
        height: 100%;

        position: relative;

        background-color: var(--bg-secondary);

        border: 2px solid var(--border-color);
        border-radius: 7px;
        box-shadow: 5px 5px 12px rgba(0, 0, 0, 0.15);
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

    > .sentenceType {
      grid-area: q;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;

      > .sentenceTypeBtn {
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

      > .targetSentence {
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
            box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.08);
          }
        }
      }

      > .nextSentence {
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
</style>
