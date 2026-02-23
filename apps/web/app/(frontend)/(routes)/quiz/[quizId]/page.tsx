import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ quizId: string }>;
}

const QuizPage = async ({ params }: PageProps) => {
  const pageParams = await params;
  redirect(`/quiz/${pageParams.quizId}/start`);
};

export default QuizPage;
