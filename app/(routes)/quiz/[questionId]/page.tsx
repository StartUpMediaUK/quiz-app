"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Page } from "@/components/ui/layout/page-layout"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft } from "lucide-react"
import { useQuiz } from "../_components/quiz-context"
import QuestionNotFound from "./_components/question-not-found"


export default function QuestionPage() {
  const { questionId } = useParams<{ questionId: string }>()
  const router = useRouter()

  const { answers, addAnswer, quiz } = useQuiz()

  const [selected, setSelected] = useState<string | null>(answers.find((a) => a.questionId === questionId)?.optionId || null)

  const questionIndex = quiz.questions.findIndex((q) => q.id === questionId)
  const question = quiz.questions[questionIndex]

  const progress = (questionIndex / quiz.questions.length) * 100

  if (!question) return <QuestionNotFound />

  const next = quiz.questions[questionIndex + 1]
  const prev = quiz.questions[questionIndex - 1]

  const handleSubmit = () => {
    if (!selected) return

    const option = question.options.find((o) => o.id === selected)
    if (!option) return

    addAnswer({ questionId: question.id, optionId: option.id, points: option.points })

    if (next) {
      router.push(`/quiz/${next.id}`)
    } else {
      router.push("/quiz/result")
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
                      key={opt.id}
                      className="border-red-200 hover:border-red-800 has-data-[state=checked]:border-red-800/50 has-data-[state=checked]:bg-accent relative flex flex-col gap-4 border outline-none rounded-md has-data-[state=checked]:z-10">
                      <div className="flex w-full items-center gap-2 px-4">
                        <RadioGroupItem
                          id={opt.id}
                          value={opt.id}
                          className="border border-red-200 hover:border-red-800 hover:bg-red-50 data-[state=checked]:bg-red-500 data-[state=checked]:text-primary-foreground data-[state=checked]:border-red-500 transition-all"
                          aria-describedby={opt.id}
                        />
                        <Label className="inline-flex items-start w-full p-4" htmlFor={opt.id}>
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
              onClick={() => router.push(`/quiz/${prev.id}`)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          ) : (
            <Button variant="outline" className="border-red-300 text-maroon hover:bg-red-50 bg-transparent" onClick={() => router.push(`/quiz`)}>
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
