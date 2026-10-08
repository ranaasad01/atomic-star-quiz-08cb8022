export interface NavLink {
  label: string;
  href: string;
  key: string;
}

export const navLinks: NavLink[] = [
  { label: "Home", href: "/", key: "home" },
  { label: "How to Play", href: "#how-to-play", key: "howToPlay" },
  { label: "Questions", href: "#questions", key: "questions" },
];

export const APP_NAME = "Star Quiz";
export const APP_TAGLINE = "8 fun questions — earn a star for every right answer!";

export const CTA_LABEL = "Let's Play! 🎉";

export type QuizQuestion = {
  id: number;
  emoji: string;
  question: string;
  answers: string[];
  correctIndex: number;
};