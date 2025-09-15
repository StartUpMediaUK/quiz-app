import { HydrateClient } from "@/trpc/server";
import { SubmissionClient } from "./_components/client";

interface QuizPageProps {
  params: { submissionId: string }
}

export default async function SubmissionPage({ params }: QuizPageProps) {
  const { submissionId } = await params;

  return (
    <HydrateClient>
      <SubmissionClient submissionId={submissionId} />
    </HydrateClient>
  )
}
