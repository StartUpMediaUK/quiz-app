import { HydrateClient } from "@/trpc/server";
import { QuizDetailClient } from "./_components/client";

interface QuizPageProps {
  params: { quizId: string }
}

export default async function QuizPage({ params }: QuizPageProps) {
  const { quizId } = await params;

  return (
    <HydrateClient>
      <QuizDetailClient quizId={quizId} />
    </HydrateClient>
  )
}
