"use client"

import { QuizWithVersion } from "@/lib/types/quiz";
import { api } from "@/trpc/react";
import { Answer, Option, QuestionCategory } from "@prisma/client";
import { useParams } from "next/navigation";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type QuizContextType = {
  answers: Answer[];
  quiz: QuizWithVersion | null;
  isLoading: boolean;
  addAnswer: (answer: Answer) => void;
  reset: () => void;
};

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const params = useParams();

  const { data: quiz, isLoading } = api.quiz.getBySlug.useQuery({ quizSlug: (params?.quizId as string) ?? "", published: true });

  const [answers, setAnswers] = useState<Answer[]>([]);
  const [questionCategories, setQuestionCategories] = useState<QuestionCategory[]>([]);

  useEffect(() => {
    if (!quiz) return;

    const randomizedCategories = quiz.version.questionCategories.map((cat) => ({
      ...cat,
      questions: cat.questions.map((q) => ({
        ...q,
        options: shuffleArray(q.options),
      })),
    }));

    setQuestionCategories(randomizedCategories);
  }, [quiz]);

  const addAnswer = (answer: Answer) => {
    setAnswers((prev) => {
      const filtered = prev.filter((a) => a.questionId !== answer.questionId);
      return [...filtered, answer];
    });
  };

  const reset = () => setAnswers([]);

  if (!quiz) {
    return <QuizContext.Provider value={{ answers, addAnswer, isLoading, reset, quiz: null }}>{children}</QuizContext.Provider>;
  }
  return (
    <QuizContext.Provider value={{ answers, addAnswer, isLoading, reset, quiz: { ...quiz, version: { ...quiz.version, questionCategories } } }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const ctx = useContext(QuizContext)
  if (!ctx) throw new Error("useQuiz must be used within QuizProvider")
  return ctx
}

function shuffleArray(array: Option[]): Option[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copy[i]!;
    copy[i] = copy[j]!;
    copy[j] = temp;
  }
  return copy;
}
