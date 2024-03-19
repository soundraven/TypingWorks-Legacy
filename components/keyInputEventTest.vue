<template>
  <div id="app">
    <input
      v-model="inputValue"
      @focus="onFocus"
      @blur="onBlur"
      @keydown="onKeyDown"
      @keypress="onKeyPress"
      @keyup="onKeyUp"
      @input="onInput"
      @change="onChange"
    />
  </div>
</template>
​
<script setup>
const onFocus = (e) => {
  console.log("focus event occur!!", `current input value: ${e.target.value}`);
};
const onBlur = (e) => {
  console.log("blur event occur!!", `current input value: ${e.target.value}`);
};
const onKeyPress = (e) => {
  console.log("keyPress event occur!!", `input key: ${e.key}/current input value: ${e.target.value}`);
};
const onKeyDown = (e) => {
  console.log("keyDown event occur!!", `input key: ${e.key}/current input value: ${e.target.value}`);
};
const onBeforeInput = (e) => {
  console.log("input event occur!!", `input key: ${e.data}/current input value: ${e.target.value}`);
};
const onInput = (e) => {
  console.log("input event occur!!", `input data: ${e.data}/current input value: ${e.target.value}`);
};
const onKeyUp = (e) => {
  console.log("keyUp event occur!!", `input key: ${e.key}/current input value: ${e.target.value}`);
};
const onChange = (e) => {
  console.log("change event occur!!", `current input value: ${e.target.value}`);
};
const onPaste = (e) => {
  console.log("paste event occur!!", `current input value: ${e.target.value}`);
};
</script>