"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useQuiz } from "../_components/quiz-context"
import QuizNotFound from "../_components/quiz-not-found"

export default function ResultPage() {
  const { answers, quiz } = useQuiz()
  const router = useRouter()

  const total = answers.reduce((sum, a) => sum + a.points, 0)
  if (!quiz) return <QuizNotFound />
  const range = quiz.resultRanges.find((r) => total >= r.min && total <= r.max)

  useEffect(() => {
    if (range) {
      router.push(range.url) // redirect to Zenler lead magnet
    }
  }, [range, router])

  if (!range) return <div>Calculating your result...</div>
  return <div>Redirecting to {range.label}...</div>
}
