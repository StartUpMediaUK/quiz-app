"use client"

import { Button } from "@/components/ui/button"
import { Page } from "@/components/ui/layout/page-layout"
import { LoadingPage } from "@/components/ui/loading"
import { getFirstQuizQuestion, getQuizLength } from "@/lib/helpers/quiz"
import { BookOpen, Clock } from "lucide-react"
import Link from "next/link"
import { useQuiz } from "../_components/quiz-context"
import QuizNotFound from "../_components/quiz-not-found"

export default function StartQuiz() {
  const { reset, quiz, isLoading } = useQuiz()
  if (isLoading) return <LoadingPage />
  
  if (!quiz) return <QuizNotFound />
  return (
    <Page gradientBackground>
      <div className="p-6 text-center space-x-2 ">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-maroon mb-6 text-balance">{quiz.version.title}</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed">{quiz.version.description}</p>

          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-5 h-5 text-orange-600" />
              <span>5-7 minutes</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <BookOpen className="w-5 h-5 text-orange-600" />
              <span>{getQuizLength(quiz?.version.questionCategories ?? [])} questions</span>
            </div>
          </div>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/`}>Back Home</Link>
        </Button>
        <Button variant="default" asChild>
          <Link
            href={`/quiz/${quiz.slug}/${getFirstQuizQuestion(quiz)?.slug}`}
            onClick={() => reset()}
            className="mt-6 inline-block rounded bg-maroon-800 px-6 py-3 text-white">
            Start Quiz
          </Link>
        </Button>
      </div>
    </Page>
  );
}
