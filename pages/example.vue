<template>
    <div class="container">
        <footer>Footer</footer>
        <header>Header</header>
        <section class="a">Section A</section>
        <section class="b">
            Section BSection BSection BSection BSection BSection B
        </section>
    </div>
</template>

<style lang="scss" module>
body {
    font-family: Helvetica;
    font-size: 1.4em;
    color: white;
    text-align: center;
}

.container {
    display: grid;
    grid-template: repeat(9, 1fr) / repeat(10, 1fr);
    grid-template-areas:
        "h h h h h h h h h h"
        "a a b b . . . . . ."
        "f f f . . . . . . ."
        ". . . . . . . . . ."
        ". . . . . . . . . ."
        ". . . . . . . . . ."
        ". . . . . . . . . ."
        ". . . . . . . . . ."
        ". . . . . . . . . .";
    > header {
        grid-area: h;
        background-color: #d0021b;
    }

    > section.a {
        grid-area: a;
        background-color: #9013fe;
    }

    > section.b {
        grid-area: b;
        background-color: #f8e71c;
    }

    > footer {
        grid-area: f;
        background-color: #50e3c2;
    }
}
</style>
