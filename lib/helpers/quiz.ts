import { QuestionCategory, Quiz } from "@prisma/client";

const getQuizLength = (questionCategories: QuestionCategory[]) => {
  const quizLength = questionCategories.reduce((sum, cat) => sum + (cat.questions?.length ?? 0), 0);

  return quizLength
}

const getFirstQuizQuestion = (quiz: Quiz) => {
  if (!quiz?.questionCategories?.length) return null;

  for (const category of quiz.questionCategories) {
    if (category.questions?.length) {
      return category.questions[0];
    }
  }

  return null; // no questions found
};

const getQuizQuestionBySlug = (quiz: Quiz, questionSlug: string) => {
  if (!quiz?.questionCategories?.length) return null;

  for (const category of quiz.questionCategories) {
    const found = category.questions?.find((q) => q.slug === questionSlug);
    if (found) return found;
  }

  return null; // question not found
};

const getQuizQuestionIndexBySlug = (quiz: Quiz, questionSlug: string): number | null => {
  if (!quiz?.questionCategories?.length) return null;

  let counter = 0;

  for (const category of quiz.questionCategories) {
    for (const question of category.questions) {
      if (question.slug === questionSlug) return counter;
      counter++;
    }
  }

  return null; // question not found
};

const getQuizQuestionByIndex = (quiz: Quiz, index: number) => {
  if (!quiz?.questionCategories?.length) return null;

  let counter = 0;

  for (const category of quiz.questionCategories) {
    for (const question of category.questions) {
      if (counter === index) return question;
      counter++;
    }
  }

  return null; // index out of bounds
};
const getQuizCategoryByQuestionSlug = (quiz: Quiz, questionSlug: string) => {
  if (!quiz?.questionCategories?.length) return null;

  for (const category of quiz.questionCategories) {
    const found = category.questions?.some((q) => q.slug === questionSlug);
    if (found) return category;
  }

  return null; // category not found
};

export { getFirstQuizQuestion, getQuizCategoryByQuestionSlug, getQuizLength, getQuizQuestionByIndex, getQuizQuestionBySlug, getQuizQuestionIndexBySlug };

