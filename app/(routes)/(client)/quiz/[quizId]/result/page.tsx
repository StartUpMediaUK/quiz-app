"use client"

import { resultRanges } from "@/lib/data/quiz"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useQuiz } from "../_components/quiz-context"

export default function ResultPage() {
  const { answers } = useQuiz()
  const router = useRouter()

  const total = answers.reduce((sum, a) => sum + a.points, 0)
  const range = resultRanges.find((r) => total >= r.min && total <= r.max)

  useEffect(() => {
    if (range) {
      router.push(range.url) // redirect to Zenler lead magnet
    }
  }, [range, router])

  if (!range) return <div>Calculating your result...</div>
  return <div>Redirecting to {range.label}...</div>
}
