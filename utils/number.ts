export const getPercentage = (
    numerator: number,
    denominator: number,
): number => {
    return Math.round((numerator / denominator) * 100)
}

export const calcSpeed = (words: number, time: number): number => {
    return Math.round((words / time) * 60)
}
