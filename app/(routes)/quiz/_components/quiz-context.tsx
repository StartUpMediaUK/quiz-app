"use client"

import { quiz } from "@/lib/data/quiz";
import { Question, Quiz } from "@/lib/types/quiz";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type Answer = { questionId: string; optionId: string; points: number }

type QuizContextType = {
  answers: Answer[]
  quiz: Quiz;
  addAnswer: (answer: Answer) => void
  reset: () => void
}

const QuizContext = createContext<QuizContextType | undefined>(undefined)

export function QuizProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<Answer[]>([])
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const randomizedQuestions = quiz.questions.map((q) => ({
      ...q,
      options: shuffleArray(q.options),
    }))
    setQuestions(randomizedQuestions)
  }, []);

  const addAnswer = (answer: Answer) => {
    setAnswers((prev) => {
      const filtered = prev.filter((a) => a.questionId !== answer.questionId)
      return [...filtered, answer]
    })
  }

  const reset = () => setAnswers([])

  return (
    <QuizContext.Provider value={{ answers, addAnswer, reset, quiz: { ...quiz,questions } }}>
      {children}
    </QuizContext.Provider>
  )
}

export function useQuiz() {
  const ctx = useContext(QuizContext)
  if (!ctx) throw new Error("useQuiz must be used within QuizProvider")
  return ctx
}

function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}