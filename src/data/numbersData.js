export const numbersData = [
  { value: 1, emoji: "🍎", word: "One" },
  { value: 2, emoji: "🍎", word: "Two" },
  { value: 3, emoji: "🍎", word: "Three" },
  { value: 4, emoji: "🍎", word: "Four" },
  { value: 5, emoji: "🍎", word: "Five" },
  { value: 6, emoji: "🍎", word: "Six" },
  { value: 7, emoji: "🍎", word: "Seven" },
  { value: 8, emoji: "🍎", word: "Eight" },
  { value: 9, emoji: "🍎", word: "Nine" },
  { value: 10, emoji: "🍎", word: "Ten" },
];

// Simple addition/subtraction practice problems using visual objects.
export const mathProblems = [
  { a: 1, b: 1, op: "+", emoji: "🍎" },
  { a: 2, b: 1, op: "+", emoji: "🍎" },
  { a: 2, b: 2, op: "+", emoji: "🍌" },
  { a: 3, b: 2, op: "+", emoji: "⭐" },
  { a: 4, b: 3, op: "+", emoji: "🎈" },
  { a: 3, b: 1, op: "-", emoji: "🍎" },
  { a: 4, b: 2, op: "-", emoji: "🍌" },
  { a: 5, b: 3, op: "-", emoji: "⭐" },
  { a: 6, b: 2, op: "-", emoji: "🎈" },
  { a: 5, b: 4, op: "-", emoji: "🍇" },
];

export function computeAnswer(problem) {
  return problem.op === "+" ? problem.a + problem.b : problem.a - problem.b;
}
