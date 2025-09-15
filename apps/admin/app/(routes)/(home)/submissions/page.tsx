"use client"

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table/data-table-2";
import { Page, PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/ui/layout/page-layout";
import { siteConfig } from "@/lib/config/site";
import { api } from "@/trpc/react";
import { RiArrowLeftLine } from "@remixicon/react";
import { format } from "date-fns";
import Link from "next/link";
import { SubmissionColumn, columns } from "./_components/columns";

export default function SubmissionsPage () {
  const {data: submissions} = api.submission.getAll.useQuery({})
  
  const formattedSubmissions: SubmissionColumn[] =
    submissions?.map((item) => ({
      id: item.objectGuid,
      quizId: item.quizVersion.quiz.objectGuid,
      quizVersion: item.quizVersion.version,
      quizVersionId: item.quizVersion.objectGuid,
      score: item.score,
      result: item.quizVersion.resultRanges.find(( resRang ) => item.resultRangeId === resRang.objectGuid)?.label ?? "",
      date: format(item.createdAt, "PPp")
    })) ?? [];

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
            Submissions
          </div>
        </PageHeaderHeading>
        <PageHeaderDescription>Some text goes here</PageHeaderDescription>
      </PageHeader>
      <div className="grid grid-cols-1">
        <DataTable data={formattedSubmissions} columns={columns} searchKey="id" />
      </div>
    </Page>
  );
}