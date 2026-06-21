export const distributeSplit = async (parts: number[]): Promise<number> => parts.reduce((a, b) => a + b, 0);

