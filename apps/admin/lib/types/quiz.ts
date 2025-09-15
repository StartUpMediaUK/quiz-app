import { Quiz, QuizSubmission, QuizVersion } from "@prisma/client";

type QuizWithVersion = Quiz & { version: QuizVersion };
type QuizVersionWithQuiz = QuizVersion & { quiz: Quiz };
type SubmissionWithQuizVersion = QuizSubmission & { quizVersion: QuizVersionWithQuiz };

export type { QuizVersionWithQuiz, QuizWithVersion, SubmissionWithQuizVersion };
