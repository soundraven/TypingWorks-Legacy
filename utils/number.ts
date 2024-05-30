export const getPercentage = (
    numerator: number,
    denominator: number,
): number => {
    if (numerator === 0) return 0
    return Math.round((numerator / denominator) * 100)
}

export const calcSpeed = (words: number, time: number): number => {
    return Math.round((words / time) * 60)
}
