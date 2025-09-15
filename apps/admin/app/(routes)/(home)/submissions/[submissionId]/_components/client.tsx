"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Page, PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/ui/layout/page-layout";
import { LoadingPage } from "@/components/ui/loading";
import { siteConfig } from "@/lib/config/site";
import { api } from "@/trpc/react";
import { Question } from "@prisma/client";
import { RiArrowLeftLine } from "@remixicon/react";
import { ExternalLink, Target, Trophy } from "lucide-react";
import Link from "next/link";

interface SubmissionClientProps {
  submissionId: string;
}

const getQuizOptionById = (optionId: string, question: Question) => {
  return (question as any).options?.find((option: any) => option.slug === optionId)
}

const SubmissionClient = ({ submissionId }: SubmissionClientProps) => {
  const {data: submission, isLoading } = api.submission.getById.useQuery({ submissionId })
  
  if (isLoading) {
    <LoadingPage />
  }
  if (!submission) return <div className="text-center py-8 text-muted-foreground">Submission not found</div>

  const { quizVersion, answers, score, resultRangeId } = submission;

  const resultRange = quizVersion.resultRanges.find(( resRang ) => resRang.objectGuid === resultRangeId)

  return (
    <Page admin>
      <PageHeader>
        <PageHeaderHeading className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost-no-hover" size="ghost" asChild>
              <Link href={`${siteConfig.baseLinks.home}`}>
                <RiArrowLeftLine className="mr-1 h-4 w-4" />
                Back
              </Link>
            </Button>
            {quizVersion.title}
            <Badge variant="secondary" className="text-xs">
              v{quizVersion.version}
            </Badge>
          </div>
        </PageHeaderHeading>
        <PageHeaderDescription>{quizVersion.description}</PageHeaderDescription>
      </PageHeader>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Submission Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Score</span>
              </div>
              <p className="text-2xl font-bold">{score}</p>
            </div>

            {resultRange && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="w-fit">
                    {resultRange.label}
                  </Badge>
                </div>
                {(resultRange as any).min !== undefined && (resultRange as any).max !== undefined && (
                  <p className="text-sm text-muted-foreground">
                    Range: {(resultRange as any).min} - {(resultRange as any).max}
                  </p>
                )}
                {(resultRange as any).url && (
                  <a
                    href={(resultRange as any).url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    View Details
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Questions & Answers</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="space-y-2">
            {quizVersion.questionCategories.map((cat: any) => (
              <AccordionItem key={cat.objectGuid} value={cat.objectGuid} className="border rounded-lg">
                <AccordionTrigger className="px-4 hover:no-underline">
                  <div className="flex items-center justify-between w-full mr-4">
                    <span className="font-medium">{cat.label}</span>
                    <Badge variant="secondary" className="text-xs">
                      {cat.questions.length} questions
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-3">
                    {cat.questions.map((q: Question) => {
                      const userAnswer = answers.find((a: any) => a.questionId === q.slug)
                      const selectedOption = userAnswer?.optionId ? getQuizOptionById(userAnswer.optionId, q) : null

                      return (
                        <div key={q.objectGuid} className="p-4 bg-muted/30 rounded-md border">
                          <p className="font-medium mb-2 text-balance">{q.text}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium">Answer:</span> {selectedOption?.text || "Not answered"}
                            </p>
                            <Badge variant={userAnswer?.points ? "default" : "secondary"} className="text-xs">
                              {userAnswer?.points ?? 0} pts
                            </Badge>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </Page>
  )
}

export { SubmissionClient };

