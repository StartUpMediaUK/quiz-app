import z from "zod";
import { required } from "./generic";

const QuestionCategorySchemaNoId = z.object({
  slug: z.string(),

  label: z.string().min(1, "Category label is required"),
  description: z.string().optional(),
  sortOrder: z.number(),
  questions: z.array(z.object({
    slug: z.string(),
    sortOrder: z.number(),

    text: z.string().min(1, "Question text is required"),
    options: z.array(z.object({
      slug: z.string(),
      sortOrder: z.number(),

      text: z.string().min(1, "Option text is required"),
      points: z.number(),
    })
    ).min(1, "At least one option is required"),
  })),
})


const quizCreateMutation = z.object({ 
  ...required,
  title: z.string().min(1, "Quiz title is required"),
  slug: z.string(),
  description: z.string(),
  questionCategories: z.array(QuestionCategorySchemaNoId).min(1, "At least one question is required"),
  published: z.boolean().default(false),

})


const QuestionCategorySchemaWithId = z.object({
  objectGuid: z.string().optional(),
  slug: z.string(),
  sortOrder: z.number(),

  label: z.string().min(1, "Category label is required"),
  description: z.string().nullable(),
  questions: z.array(z.object({
    objectGuid: z.string().optional(),
    slug: z.string(),
    sortOrder: z.number(),

    text: z.string().min(1, "Question text is required"),
    options: z.array(z.object({
      objectGuid: z.string().optional(),
      slug: z.string(),
      sortOrder: z.number(),

      text: z.string().min(1, "Option text is required"),
      points: z.number(),
    })
    ).min(1, "At least one option is required"),
    category: z.string(),
  })),
})

const quizEditMutation = z.object({ 
  ...required,
  quizId: z.string(),
  objectGuid: z.string(),
  title: z.string().min(1, "Quiz title is required"),
  
  slug: z.string(),
  description: z.string(),
  questionCategories: z.array(QuestionCategorySchemaWithId).min(1, "At least one question is required"),
  published: z.boolean().default(false),

})

export { quizCreateMutation, quizEditMutation };

