export const getPercentage = (value: number, max: number): number => {
    return Math.round((value / max) * 100)
}
