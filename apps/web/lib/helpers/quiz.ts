import { QuestionCategory } from "@prisma/client";
import { QuizWithVersion } from "../types/quiz";

const getQuizLength = (questionCategories: QuestionCategory[]) => {
  const quizLength = questionCategories.reduce((sum, cat) => sum + (cat.questions?.length ?? 0), 0);

  return quizLength
}

const getFirstQuizQuestion = (quiz: QuizWithVersion) => {
  if (!quiz?.version?.questionCategories?.length) return null;

  for (const category of quiz.version.questionCategories) {
    if (category.questions?.length) {
      return category.questions[0];
    }
  }

  return null; // no questions found
};

const getQuizQuestionBySlug = (quiz: QuizWithVersion, questionSlug: string) => {
  if (!quiz?.version?.questionCategories?.length) return null;

  for (const category of quiz.version.questionCategories) {
    const found = category.questions?.find((q) => q.slug === questionSlug);
    if (found) return found;
  }

  return null; // question not found
};

const getQuizQuestionIndexBySlug = (quiz: QuizWithVersion, questionSlug: string): number | null => {
  if (!quiz?.version?.questionCategories?.length) return null;

  let counter = 0;

  for (const category of quiz.version.questionCategories) {
    for (const question of category.questions) {
      if (question.slug === questionSlug) return counter;
      counter++;
    }
  }

  return null; // question not found
};

const getQuizQuestionByIndex = (quiz: QuizWithVersion, index: number) => {
  if (!quiz?.version?.questionCategories?.length) return null;

  let counter = 0;

  for (const category of quiz.version.questionCategories) {
    for (const question of category.questions) {
      if (counter === index) return question;
      counter++;
    }
  }

  return null; // index out of bounds
};
const getQuizCategoryByQuestionSlug = (quiz: QuizWithVersion, questionSlug: string) => {
  if (!quiz?.version?.questionCategories?.length) return null;

  for (const category of quiz.version.questionCategories) {
    const found = category.questions?.some((q) => q.slug === questionSlug);
    if (found) return category;
  }

  return null; // category not found
};

export { getFirstQuizQuestion, getQuizCategoryByQuestionSlug, getQuizLength, getQuizQuestionByIndex, getQuizQuestionBySlug, getQuizQuestionIndexBySlug };

