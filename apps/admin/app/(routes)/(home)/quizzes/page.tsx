"use client"

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table/data-table-2";
import { Page, PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/ui/layout/page-layout";
import { siteConfig } from "@/lib/config/site";
import { api } from "@/trpc/react";
import { RiArrowLeftLine } from "@remixicon/react";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { QuizColumn, quizColumns } from "./_components/columns";

export default function QuizzesPage () {
  const {data: quizzes} = api.quiz.getAll.useQuery({})
  
  const formattedQuizzes: QuizColumn[] = quizzes?.map((item) => ({
    id: item.objectGuid,
    title: item.title,
    questions: item.questionCategories.reduce((acc, category) => acc + (category.questions.length ?? 0), 0),
    published: item.published,
  })) ?? []

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
            Quizzes
          </div>
          <Button asChild>
            <Link href={siteConfig.baseLinks.quizzes+"/create"}>
              <PlusIcon /> 
              New Quiz
            </Link>
          </Button>
        </PageHeaderHeading>
        <PageHeaderDescription>Some text goes here</PageHeaderDescription>
      </PageHeader>
      <DataTable data={formattedQuizzes} columns={quizColumns} />
    </Page>
  )
}