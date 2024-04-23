<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="feather feather-moon"
    >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
</template>

<style scoped>
.feather {
    position: relative;
    top: 0px;
    cursor: pointer;
    padding: 7px;
    background-color: var(--bg-secondary);
    border: 2px solid var(--border-color);
    margin: 0;
    border-radius: 5px;
    transition: all 0.1s ease;
}
.feather:hover {
    top: -3px;
}
.feather.preferred {
    border-color: var(--color-primary);
    top: -3px;
}
.feather.selected {
    color: var(--color-primary);
}
</style>
