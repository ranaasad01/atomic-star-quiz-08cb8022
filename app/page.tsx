"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { APP_NAME, APP_TAGLINE } from "@/lib/data";
type QUIZ_QUESTIONS = any;
const QUIZ_QUESTIONS: any = new Proxy([], { get: (t: any, k) => (k in t ? t[k] : "") });
type CORRECT_MESSAGES = any;
const CORRECT_MESSAGES: any = new Proxy([], { get: (t: any, k) => (k in t ? t[k] : "") });
type WRONG_MESSAGES = any;
const WRONG_MESSAGES: any = new Proxy([], { get: (t: any, k) => (k in t ? t[k] : "") });
type SCORE_MESSAGES = any;
const SCORE_MESSAGES: any = new Proxy([], { get: (t: any, k) => (k in t ? t[k] : "") });
import { bounceIn, staggerContainer, scaleIn } from "@/lib/motion";
import { Reveal } from "@/components/Reveal";

// ─── Types ────────────────────────────────────────────────────────────────────
type Phase = "intro" | "quiz" | "result";
type AnswerState = "idle" | "correct" | "wrong";

// ─── Inline variants ──────────────────────────────────────────────────────────
const cardSlide: Variants = {
  hidden: { opacity: 0, x: 60, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    x: -60,
    scale: 0.95,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.7 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 380, damping: 20 },
  },
};

// ─── Answer button colours (cycling) ─────────────────────────────────────────
const BUTTON_COLOURS = [
  { base: "bg-[var(--btn-a)]", hover: "hover:bg-[var(--btn-a-h)]", border: "border-[var(--btn-a-b)]" },
  { base: "bg-[var(--btn-b)]", hover: "hover:bg-[var(--btn-b-h)]", border: "border-[var(--btn-b-b)]" },
  { base: "bg-[var(--btn-c)]", hover: "hover:bg-[var(--btn-c-h)]", border: "border-[var(--btn-c-b)]" },
  { base: "bg-[var(--btn-d)]", hover: "hover:bg-[var(--btn-d-h)]", border: "border-[var(--btn-d-b)]" },
];

// ─── How it works data ────────────────────────────────────────────────────────
const HOW_IT_WORKS = [
  { emoji: "🎯", title: "Pick an answer", desc: "Tap one of the four big colourful buttons to choose your answer." },
  { emoji: "⭐", title: "Earn a star", desc: "Get it right and a shiny star is added to your collection!" },
  { emoji: "💪", title: "Keep going", desc: "Wrong answers are okay — a friendly hint keeps you going." },
  { emoji: "🏆", title: "See your score", desc: "After 8 questions, find out how many stars you collected!" },
];

// ─── Fun facts data ───────────────────────────────────────────────────────────
const FUN_FACTS = [
  { emoji: "🐘", fact: "Elephants are the only animals that can't jump!" },
  { emoji: "🌈", fact: "A rainbow always appears opposite the Sun." },
  { emoji: "🚀", fact: "Mercury is so close to the Sun that a year there lasts just 88 days!" },
  { emoji: "🐬", fact: "Dolphins sleep with one eye open to watch for danger." },
  { emoji: "🦜", fact: "Flamingos are born white — they turn pink from the food they eat!" },
  { emoji: "🐝", fact: "A single bee makes only about one teaspoon of honey in its lifetime." },
];

// ─── Helper ───────────────────────────────────────────────────────────────────
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarRow({ count, total }: { count: number; total: number }) {
  return (
    <div className="flex gap-1 justify-center flex-wrap" aria-label={`${count} stars earned`}>
      {Array.from({ length: total }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.06, type: "spring", stiffness: 300, damping: 16 }}
          className={`text-2xl md:text-3xl select-none ${i < count ? "grayscale-0" : "grayscale opacity-25"}`}
        >
          ⭐
        </motion.span>
      ))}
    </div>
  );
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="w-full bg-white/40 rounded-full h-4 overflow-hidden border border-white/60 shadow-inner">
      <motion.div
        className="h-full rounded-full bg-[var(--accent)]"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
        role="progressbar"
      />
    </div>
  );
}

// ─── Screens ──────────────────────────────────────────────────────────────────

function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <Reveal>
      <div className="flex flex-col items-center gap-8 py-10 text-center">
        <motion.div variants={bounceIn} initial="hidden" animate="visible" className="text-8xl md:text-9xl select-none">
          🌟
        </motion.div>
        <div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-[var(--quiz-heading)] leading-tight text-balance">
            {APP_NAME}
          </h1>
          <p className="mt-3 text-xl md:text-2xl text-[var(--quiz-sub)] font-medium">{APP_TAGLINE}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 w-full max-w-xs text-left">
          {[
            ["🐾", "Animals"],
            ["🎨", "Colours"],
            ["🚀", "Space"],
            ["⭐", "8 Questions"],
          ].map(([emoji, label]) => (
            <div
              key={label}
              className="flex items-center gap-2 bg-white/70 rounded-2xl px-4 py-3 text-base font-semibold text-[var(--quiz-heading)] shadow-sm border border-white/80"
            >
              <span className="text-xl">{emoji}</span> {label}
            </div>
          ))}
        </div>
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
          onClick={onStart}
          className="mt-2 px-10 py-5 rounded-full bg-[var(--accent)] text-white text-2xl font-extrabold shadow-[0_4px_24px_rgba(0,0,0,0.18)] hover:bg-[var(--accent-h)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent)]/50"
        >
          Let&apos;s Play! 🎉
        </motion.button>
      </div>
    </Reveal>
  );
}

function QuizScreen({
  questionIndex,
  score,
  onAnswer,
}: {
  questionIndex: number;
  score: number;
  onAnswer: (correct: boolean) => void;
}) {
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");

  const q = QUIZ_QUESTIONS[questionIndex];

  const handleAnswer = useCallback(
    (idx: number) => {
      if (answerState !== "idle") return;
      const correct = idx === q.correctIndex;
      setSelectedIndex(idx);
      setAnswerState(correct ? "correct" : "wrong");
      setFeedback(correct ? pickRandom(CORRECT_MESSAGES) : pickRandom(WRONG_MESSAGES));
      setTimeout(() => {
        setAnswerState("idle");
        setSelectedIndex(null);
        setFeedback("");
        onAnswer(correct);
      }, 1600);
    },
    [answerState, q.correctIndex, onAnswer]
  );

  function buttonClass(idx: number): string {
    const col = BUTTON_COLOURS[idx];
    if (answerState === "idle") {
      return `${col.base} ${col.hover} ${col.border} text-white`;
    }
    if (idx === q.correctIndex) {
      return "bg-green-400 border-green-500 text-white scale-105";
    }
    if (idx === selectedIndex && answerState === "wrong") {
      return "bg-red-400 border-red-500 text-white";
    }
    return `${col.base} ${col.border} text-white opacity-50`;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={questionIndex}
        variants={cardSlide}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="flex flex-col gap-6"
      >
        <ProgressBar current={questionIndex} total={8} />
        <div className="flex items-center justify-between text-sm font-semibold text-[var(--quiz-sub)]">
          <span>Question {questionIndex + 1} of 8</span>
          <span>⭐ {score}</span>
        </div>
        <div className="text-center">
          <div className="text-6xl mb-3">{q.emoji}</div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--quiz-heading)] text-balance">
            {q.question}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {q.answers.map((answer: string, idx: number) => (
            <motion.button
              key={idx}
              whileHover={answerState === "idle" ? { scale: 1.03 } : {}}
              whileTap={answerState === "idle" ? { scale: 0.97 } : {}}
              onClick={() => handleAnswer(idx)}
              className={`rounded-2xl border-2 px-5 py-4 text-lg font-bold text-left transition-all duration-200 shadow-sm ${buttonClass(idx)}`}
              disabled={answerState !== "idle"}
            >
              {answer}
            </motion.button>
          ))}
        </div>
        <AnimatePresence>
          {feedback && (
            <motion.div
              variants={popIn}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.8 }}
              className={`text-center text-xl font-extrabold py-3 rounded-2xl ${
                answerState === "correct"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {feedback}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}

function ResultScreen({ score, total, onRestart }: { score: number; total: number; onRestart: () => void }) {
  const msg = SCORE_MESSAGES[score] || SCORE_MESSAGES[0];
  const fact = pickRandom(FUN_FACTS);
  return (
    <Reveal>
      <div className="flex flex-col items-center gap-8 py-10 text-center">
        <motion.div variants={bounceIn} initial="hidden" animate="visible" className="text-8xl select-none">
          🏆
        </motion.div>
        <div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[var(--quiz-heading)]">Quiz Complete!</h2>
          <p className="mt-2 text-xl text-[var(--quiz-sub)] font-medium">{msg}</p>
        </div>
        <StarRow count={score} total={total} />
        <p className="text-3xl font-extrabold text-[var(--accent)]">
          {score} / {total} Stars
        </p>
        <div className="bg-white/70 rounded-2xl px-6 py-4 border border-white/80 shadow-sm max-w-sm text-left">
          <p className="text-2xl mb-1">{fact.emoji}</p>
          <p className="text-base font-semibold text-[var(--quiz-heading)]">{fact.fact}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
          onClick={onRestart}
          className="px-10 py-5 rounded-full bg-[var(--accent)] text-white text-2xl font-extrabold shadow-[0_4px_24px_rgba(0,0,0,0.18)] hover:bg-[var(--accent-h)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent)]/50"
        >
          Play Again! 🔄
        </motion.button>
      </div>
    </Reveal>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);

  const TOTAL = 8;

  const handleStart = useCallback(() => {
    setPhase("quiz");
    setQuestionIndex(0);
    setScore(0);
  }, []);

  const handleAnswer = useCallback(
    (correct: boolean) => {
      const newScore = correct ? score + 1 : score;
      if (questionIndex + 1 >= TOTAL) {
        setScore(newScore);
        setPhase("result");
      } else {
        setScore(newScore);
        setQuestionIndex((i) => i + 1);
      }
    },
    [score, questionIndex]
  );

  const handleRestart = useCallback(() => {
    setPhase("intro");
    setQuestionIndex(0);
    setScore(0);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl bg-[var(--card)] rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.13)] border border-[var(--border)] p-6 md:p-10">
        <AnimatePresence mode="wait">
          {phase === "intro" && (
            <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <IntroScreen onStart={handleStart} />
            </motion.div>
          )}
          {phase === "quiz" && (
            <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <QuizScreen questionIndex={questionIndex} score={score} onAnswer={handleAnswer} />
            </motion.div>
          )}
          {phase === "result" && (
            <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ResultScreen score={score} total={TOTAL} onRestart={handleRestart} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
