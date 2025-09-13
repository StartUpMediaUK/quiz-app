import { QuizProvider } from "./[quizId]/_components/quiz-context"

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return (
    <QuizProvider>{children}</QuizProvider>
  )
}
