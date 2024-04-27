export const getPercentage = (
    typedText: number,
    targetText: number,
): number => {
    return Math.round((typedText / targetText) * 100)
}

export const calcSpeed = (words: number, time: number): number => {
    return Math.round((words / time) * 60)
}
