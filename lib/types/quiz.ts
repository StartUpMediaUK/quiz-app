type Quiz = {
  id: string
  title: string
  description: string
  questions: Question[]
}

type Question = {
  id: string
  categoryId: string;
  text: string
  options: Option[]
}

type QuestionCategory = {
  id: string;
  label: string;
}

type Option = {
  id: string
  text: string
  points: number;
}

export type { Option, Question, QuestionCategory, Quiz }

