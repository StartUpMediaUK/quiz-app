"use client"

import { redirect, useParams, useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Page } from "@/components/ui/layout/page-layout"
import { LoadingSpinner } from "@/components/ui/loading"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { getQuizCategoryByQuestionSlug, getQuizLength, getQuizQuestionByIndex, getQuizQuestionBySlug, getQuizQuestionIndexBySlug } from "@/lib/helpers/quiz"
import { ArrowLeft } from "lucide-react"
import { useQuiz } from "../_components/quiz-context"
import QuestionNotFound from "./_components/question-not-found"


export default function QuestionPage() {
  const { questionId } = useParams<{ questionId: string }>()
  const router = useRouter()

  const { answers, addAnswer, quiz, isLoading } = useQuiz()

  if (!quiz) redirect("/")
  const [selected, setSelected] = useState<string | null>(answers.find((a) => a.questionId === questionId)?.optionId || null)

  const questionIndex = getQuizQuestionIndexBySlug(quiz, questionId) ?? 0
  const question = getQuizQuestionBySlug(quiz, questionId)
  const category = getQuizCategoryByQuestionSlug(quiz, questionId)

  if (isLoading) return <LoadingSpinner />
  if (!question) return <QuestionNotFound />
  const progress = (questionIndex / getQuizLength(quiz.questionCategories)) * 100


  const next = getQuizQuestionByIndex(quiz, questionIndex + 1)
  const prev = getQuizQuestionByIndex(quiz, questionIndex - 1)

  const handleSubmit = () => {
    if (!selected) return

    const option = question.options.find((o) => o.slug === selected)
    if (!option) return

    addAnswer({ questionId: question.slug, optionId: option.slug, points: option.points })

    if (next) {
      router.push(`/quiz/${quiz.slug}/${next.slug}`)
    } else {
      router.push(`/quiz/${quiz.slug}/result`)
    }
  }

  return (
    <Page paddingTop={false} gradientBackground>
      <div className="p-6 space-y-6">
        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        <h1 className="text-center text-2xl font-serif font-normal">{category?.label}</h1>

        {/* Question Card */}
        <div className="max-w-2xl mx-auto">
          <Card className="border-red-200 bg-white/80 backdrop-blur-sm shadow-lg">
            <fieldset className="space-y-4">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl md:text-3xl font-serif text-maroon mb-4 text-balance">
                  <legend>{question.text}</legend>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup className="gap-4 -space-y-px rounded-md shadow-xs" value={selected ?? ""} onValueChange={(val) => setSelected(val)}>
                  {question.options.map((opt) => (
                    <div
                      key={opt.slug}
                      className="border-red-200 hover:border-red-800 has-data-[state=checked]:border-red-800/50 has-data-[state=checked]:bg-accent relative flex flex-col gap-4 border outline-none rounded-md has-data-[state=checked]:z-10">
                      <div className="flex w-full items-center gap-2 px-4">
                        <RadioGroupItem
                          id={opt.slug}
                          value={opt.slug}
                          className="border border-red-200 hover:border-red-800 hover:bg-red-50 data-[state=checked]:bg-red-500 data-[state=checked]:text-primary-foreground data-[state=checked]:border-red-500 transition-all"
                          aria-describedby={opt.slug}
                        />
                        <Label className="inline-flex items-start w-full p-4" htmlFor={opt.slug}>
                          {opt.text}
                        </Label>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </fieldset>
          </Card>
        </div>
        <div className="flex justify-between items-center gap-2">
          {prev ? (
            <Button
              variant="outline"
              className="border-red-300 text-maroon hover:bg-red-50 bg-transparent"
              onClick={() => router.push(`/quiz/${quiz.slug}/${prev.slug}`)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          ) : (
            <Button variant="outline" className="border-red-300 text-maroon hover:bg-red-50 bg-transparent" onClick={() => router.push(`/quiz/${quiz.slug}`)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Start
            </Button>
          )}
          <Button onClick={handleSubmit} className="bg-red-800 hover:bg-red-900 text-white" disabled={!selected}>
            {next ? "Next" : "Submit"}
          </Button>
        </div>
      </div>
    </Page>
  );
}
