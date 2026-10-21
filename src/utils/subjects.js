import { COLORS } from "../constants/theme";

// Every quiz category and game maps onto one of the five learning subjects,
// so games count toward a child's subject performance too.
export const SUBJECTS = [
  { key: "Alphabet", color: COLORS.secondary },
  { key: "Numbers", color: COLORS.blue },
  { key: "Colors", color: COLORS.yellow },
  { key: "Shapes", color: COLORS.green },
  { key: "Animals", color: COLORS.purple },
];

const CATEGORY_TO_SUBJECT = {
  alphabet: "Alphabet",
  numbers: "Numbers",
  colors: "Colors",
  shapes: "Shapes",
  animals: "Animals",
  findLetter: "Alphabet",
  countObjects: "Numbers",
  findColor: "Colors",
  matchShape: "Shapes",
  guessAnimal: "Animals",
};

export function subjectFor(category) {
  return CATEGORY_TO_SUBJECT[category] ?? null;
}

export const CATEGORY_LABELS = {
  alphabet: "Alphabet",
  numbers: "Numbers",
  colors: "Colors",
  shapes: "Shapes",
  animals: "Animals",
  findLetter: "Find the Letter",
  countObjects: "Count the Objects",
  findColor: "Find the Color",
  matchShape: "Match the Shape",
  guessAnimal: "Guess the Animal",
};

/** Averages every result per subject into a 0-100 score. */
export function performanceFromResults(results) {
  return SUBJECTS.map(({ key, color }) => {
    const forSubject = results.filter((r) => subjectFor(r.category) === key);
    const attempts = forSubject.length;

    if (attempts === 0) return { subject: key, color, score: null, attempts: 0 };

    const ratio =
      forSubject.reduce((sum, r) => sum + (r.total ? r.score / r.total : 0), 0) / attempts;

    return { subject: key, color, score: Math.round(ratio * 100), attempts };
  });
}

/** Subjects practised at least once but still scoring below 70%. */
export function weakSubjects(performance) {
  return performance
    .filter((p) => p.attempts > 0 && p.score < 70)
    .sort((a, b) => a.score - b.score);
}

const ACTIVITY_SUGGESTIONS = {
  Alphabet: { icon: "🔤", text: "Go through the alphabet cards together and say each letter out loud." },
  Numbers: { icon: "🔢", text: "Practice counting from 1–10 and try a few simple addition problems." },
  Colors: { icon: "🎨", text: "Point out colors around the house, then play 'Find the Color'." },
  Shapes: { icon: "🔷", text: "Look for circles and squares around the room, then play 'Match the Shape'." },
  Animals: { icon: "🐶", text: "Explore the animal cards and copy the animal sounds together." },
};

export function recommendationsFor(performance) {
  const weak = weakSubjects(performance);

  if (weak.length > 0) {
    return weak.slice(0, 3).map((p) => ACTIVITY_SUGGESTIONS[p.subject]);
  }

  // Nothing is struggling — suggest whatever has had the least practice.
  const leastPractised = [...performance]
    .filter((p) => p.attempts === 0)
    .slice(0, 3)
    .map((p) => ACTIVITY_SUGGESTIONS[p.subject]);

  return leastPractised.length > 0 ? leastPractised : [];
}
