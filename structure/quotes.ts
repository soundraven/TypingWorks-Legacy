export interface Quote {
    person: string
    quote: string
}

export enum TypoStatus {
    NotInput = 0,
    Correct = 1,
    Error = 2,
}

//enum첫글자대문자
export enum Language {
    korean = "ko",
    english = "en",
}
