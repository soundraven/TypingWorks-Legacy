export const getPercentage = (
    typedText: number,
    targetText: number,
): number => {
    return Math.round((typedText / targetText) * 100)
}
