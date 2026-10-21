// Each quiz is keyed by category id. Every question has 3 options, one correct.
const quizData = {
  alphabet: {
    title: "Alphabet Quiz",
    icon: "🔤",
    questions: [
      { question: "Which letter comes after A?", options: ["B", "C", "Z"], answer: "B" },
      { question: "What does 'D' stand for?", options: ["Cat", "Dog", "Sun"], answer: "Dog" },
      { question: "Which letter is this? 🍎 starts with...", options: ["A", "B", "M"], answer: "A" },
      { question: "What comes before 'M'?", options: ["N", "L", "K"], answer: "L" },
      { question: "'Z' is for which animal?", options: ["Zebra", "Lion", "Cat"], answer: "Zebra" },
    ],
  },
  numbers: {
    title: "Numbers Quiz",
    icon: "🔢",
    questions: [
      { question: "🍎🍎 + 🍎 = ?", options: ["2", "3", "4"], answer: "3" },
      { question: "How many stars? ⭐⭐⭐⭐", options: ["3", "4", "5"], answer: "4" },
      { question: "What number comes after 5?", options: ["4", "6", "7"], answer: "6" },
      { question: "5 - 2 = ?", options: ["2", "3", "4"], answer: "3" },
      { question: "What number is this? 🔟", options: ["9", "10", "8"], answer: "10" },
    ],
  },
  colors: {
    title: "Colors Quiz",
    icon: "🎨",
    questions: [
      { question: "What color is the banana? 🍌", options: ["Yellow", "Red", "Blue"], answer: "Yellow" },
      { question: "What color is the sky? ☀️", options: ["Green", "Blue", "Purple"], answer: "Blue" },
      { question: "What color is grass? 🌱", options: ["Green", "Orange", "Black"], answer: "Green" },
      { question: "What color is a strawberry? 🍓", options: ["Red", "White", "Yellow"], answer: "Red" },
      { question: "What color is a cloud? ☁️", options: ["White", "Purple", "Red"], answer: "White" },
    ],
  },
  shapes: {
    title: "Shapes Quiz",
    icon: "🔷",
    questions: [
      { question: "A ball is shaped like a...", options: ["Circle", "Square", "Star"], answer: "Circle" },
      { question: "A door is shaped like a...", options: ["Oval", "Rectangle", "Star"], answer: "Rectangle" },
      { question: "How many sides does a triangle have?", options: ["2", "3", "4"], answer: "3" },
      { question: "A dice is shaped like a...", options: ["Square", "Triangle", "Oval"], answer: "Square" },
      { question: "What shape has 5 points?", options: ["Circle", "Star", "Square"], answer: "Star" },
    ],
  },
  animals: {
    title: "Animals Quiz",
    icon: "🐶",
    questions: [
      { question: "Which animal says 'Moo'?", options: ["Cow", "Dog", "Cat"], answer: "Cow" },
      { question: "Which animal is the King of the Jungle?", options: ["Monkey", "Lion", "Cow"], answer: "Lion" },
      { question: "Which animal has a trunk?", options: ["Elephant", "Chicken", "Cat"], answer: "Elephant" },
      { question: "Which animal says 'Meow'?", options: ["Dog", "Cat", "Lion"], answer: "Cat" },
      { question: "Which animal lays eggs?", options: ["Chicken", "Cow", "Dog"], answer: "Chicken" },
    ],
  },
};

export default quizData;
