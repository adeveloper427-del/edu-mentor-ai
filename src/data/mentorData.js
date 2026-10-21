export const suggestedQuestions = [
  "Teach me ABC",
  "Help me count",
  "What is an animal?",
  "Teach me colors",
];

// Picture buttons for children who cannot read yet: big icon, one-word label,
// and the full question that actually gets sent to the mentor.
export const pictureQuestions = [
  { icon: "🔤", label: "ABC", question: "Teach me ABC" },
  { icon: "🔢", label: "Count", question: "Help me count to ten" },
  { icon: "🎨", label: "Colors", question: "Teach me colors" },
  { icon: "🐶", label: "Animals", question: "Tell me about animals" },
  { icon: "🔷", label: "Shapes", question: "Teach me shapes" },
  { icon: "📖", label: "Story", question: "Tell me a very short fun story" },
];

const responseBank = [
  {
    keywords: ["abc", "alphabet", "letter"],
    reply: "Let's learn the alphabet! 🔤 A is for Apple 🍎, B is for Ball ⚽, C is for Cat 🐱. Want to hear more letters?",
  },
  {
    keywords: ["count", "number", "1", "2", "3"],
    reply: "Let's count together! 1️⃣ 2️⃣ 3️⃣... Count the apples: 🍎🍎🍎 — that's 3 apples! 🎉",
  },
  {
    keywords: ["2 + 2", "2+2", "two plus two"],
    reply: "Let's count together! 🍎🍎 + 🍎🍎 = 4 🎉",
  },
  {
    keywords: ["animal"],
    reply: "An animal is a living creature like a Dog 🐶, Cat 🐱, or Lion 🦁! Animals can walk, swim, or fly. Which animal do you like?",
  },
  {
    keywords: ["color", "colour"],
    reply: "Colors are everywhere! 🎨 The sky is Blue 🔵, the sun is Yellow 🟡, and grass is Green 🟢. What's your favorite color?",
  },
  {
    keywords: ["shape"],
    reply: "Shapes are fun! ⭐ A circle is round like a ball, and a square has 4 equal sides like a box!",
  },
  {
    keywords: ["hello", "hi", "hey"],
    reply: "Hi there, friend! 👋 I'm so happy to see you. What would you like to learn today?",
  },
];

export function getMentorReply(message) {
  const text = message.toLowerCase();
  const match = responseBank.find((entry) =>
    entry.keywords.some((keyword) => text.includes(keyword))
  );
  if (match) return match.reply;
  return "Great question! 🌟 Let's explore that together. Try asking me about ABC, numbers, colors, shapes, or animals!";
}

export const initialMessages = [
  {
    id: "m0",
    sender: "mentor",
    text: "Hi! 👋 What would you like to learn?",
  },
];
