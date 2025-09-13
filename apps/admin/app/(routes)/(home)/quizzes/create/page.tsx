import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/ui/layout/page-layout";
import { HydrateClient } from "@/trpc/server";
import { QuizForm } from "./_components/form";

export default async function QuizzesPage () {
  return (
    <HydrateClient>
      <PageHeader>
        <PageHeaderHeading className="flex items-center justify-between">
          Quiz Create
        </PageHeaderHeading>
        <PageHeaderDescription>Some text goes here</PageHeaderDescription>
      </PageHeader>
      <QuizForm />
    </HydrateClient>
  )
}