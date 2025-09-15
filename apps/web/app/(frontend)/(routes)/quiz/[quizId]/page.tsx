import { redirect } from "next/navigation";

interface PageProps {
  params: { quizId: string };
}

const QuizPage = ({ params }: PageProps) => {
  redirect(`/quiz/${params.quizId}/start`);
};

export default QuizPage;
