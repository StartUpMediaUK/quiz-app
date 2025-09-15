"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Page, PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/ui/layout/page-layout"
import { LoadingPage } from "@/components/ui/loading"
import { siteConfig } from "@/lib/config/site"
import { api } from "@/trpc/react"
import { RiArrowLeftLine, RiPokerDiamondsFill, RiPokerDiamondsLine } from "@remixicon/react"
import { LoaderCircle } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { EditQuizForm } from "./forms/edit-form";

interface QuizDetailClientProps {
  quizId: string;
}

export const QuizDetailClient = ({ quizId }: QuizDetailClientProps) => {
  const searchParams = useSearchParams();
  const versionParam = searchParams.get("version");

  const { data: quiz, isLoading } = api.quiz.getById.useQuery({ quizId, versionId: versionParam ?? undefined });
  const utils = api.useUtils();

  const togglePublishQuiz = api.quiz.togglePublishQuiz.useMutation({
    onSuccess: async () => {
      toast(`Successfully updated quiz`, {});
      await utils.quiz.invalidate();
    },
  });
  if (isLoading) {
    return <LoadingPage />;
  }
  if (!quiz) {
    return <div>Quiz not found.</div>;
  }

  return (
    <Page admin>
      <PageHeader>
        <PageHeaderHeading className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost-no-hover" size="ghost" asChild>
              <Link href={`${siteConfig.baseLinks.quizzes}`}>
                <RiArrowLeftLine className="mr-1 h-4 w-4" />
                Back
              </Link>
            </Button>
            {quiz.version.title} <span className="-ml-3 -mb-3 text-sm">v{quiz.version.version}</span>
            <Badge variant={quiz.published ? "default" : "secondary"}>{quiz.published ? "Published" : "Draft"}</Badge>
          </div>
          {quiz.published ? (
            <Button variant="outline" onClick={() => togglePublishQuiz.mutateAsync({ quizId: quiz.id, publishToggle: false })}>
              <RiPokerDiamondsLine className="mr-1 h-4 w-4" />
              {togglePublishQuiz.status === "pending" ? (
                <>
                  <LoaderCircle className="animate-spin mr-1 h-4 w-4" /> Unpublishing Quiz
                </>
              ) : (
                "Unpublish Quiz"
              )}
            </Button>
          ) : (
            <Button variant="primary" onClick={() => togglePublishQuiz.mutateAsync({ quizId: quiz.id, publishToggle: true })}>
              <RiPokerDiamondsFill className="mr-1 h-4 w-4" />
              {togglePublishQuiz.status === "pending" ? (
                <>
                  <LoaderCircle className="animate-spin mr-1 h-4 w-4" /> Publishing Quiz
                </>
              ) : (
                "Publish Quiz"
              )}
            </Button>
          )}
        </PageHeaderHeading>
        <PageHeaderDescription>{quiz.version.description || "No description provided for this quiz."}</PageHeaderDescription>
      </PageHeader>
      <EditQuizForm data={quiz} />
    </Page>
  );
};
