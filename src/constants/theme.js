// Central design tokens for Edu Mentor AI.
export const COLORS = {
  primary: "#6C63FF",
  primaryDark: "#4B41E0",
  secondary: "#FF9F45",
  accent: "#00C2A8",
  pink: "#FF6B9A",
  yellow: "#FFC93C",
  blue: "#4FC3F7",
  green: "#66D186",
  purple: "#B084F5",
  red: "#FF6B6B",

  bg: "#F6F7FF",
  bgAlt: "#FFFFFF",
  cardShadow: "#3E3A8C",

  textDark: "#2B2A4C",
  textMuted: "#7B7A9C",
  textOnPrimary: "#FFFFFF",

  white: "#FFFFFF",
  black: "#1A1A2E",

  parentPrimary: "#3A5BA0",
  parentBg: "#F1F4FA",
  parentCard: "#FFFFFF",
  parentAccent: "#2FBF9F",

  adminPrimary: "#2C3E50",
  adminBg: "#EEF1F5",
  adminAccent: "#5B6EF5",

  success: "#3FC97A",
  warning: "#FFB020",
  danger: "#FF5A5F",

  border: "#E7E8F5",
};

export const CATEGORY_COLORS = [
  "#FF9F45",
  "#4FC3F7",
  "#66D186",
  "#B084F5",
  "#FF6B9A",
  "#FFC93C",
  "#6C63FF",
  "#00C2A8",
  "#FF6B6B",
];

export const RADIUS = {
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  pill: 999,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONT = {
  h1: 32,
  h2: 26,
  h3: 20,
  body: 16,
  small: 13,
  tiny: 11,
};

export const SHADOW = {
  card: {
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  soft: {
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
};
