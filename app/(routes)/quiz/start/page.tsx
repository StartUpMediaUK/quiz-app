"use client"

import { Button } from "@/components/ui/button"
import { Page } from "@/components/ui/layout/page-layout"
import { BookOpen, Clock } from "lucide-react"
import Link from "next/link"
import { useQuiz } from "../_components/quiz-context"

export default function StartQuiz() {
  const { reset, quiz } = useQuiz()

  return (
    <Page>
      <div className="p-6 text-center space-x-2">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-maroon mb-6 text-balance">
            {quiz.title}
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed">
            {quiz.description}
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-5 h-5 text-orange-600" />
              <span>5-7 minutes</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <BookOpen className="w-5 h-5 text-orange-600" />
              <span>{quiz?.questions?.length} questions</span>
            </div>
          </div>
        </div>
        <Button variant="outline" asChild>
          <Link
            href={`/`}
          >
            Back Home
          </Link>
        </Button>
        <Button variant="default" asChild>
          <Link
            href={`/quiz/${quiz?.questions[0]?.id}`}
            onClick={() => reset()}
            className="mt-6 inline-block rounded bg-maroon-800 px-6 py-3 text-white"
          >
            Start Quiz
          </Link>
        </Button>
      </div>
    </Page>
  )
}
