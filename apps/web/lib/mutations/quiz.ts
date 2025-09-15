import z from "zod";
import { required } from "./generic";

const quizSubmitMutation = z.object({
  ...required,
  quizId: z.string(),
  answers: z.array(
    z.object({
      questionId: z.string(),
      optionId: z.string(),
      points: z.number(),
    })
  ),
  score: z.number(),
  resultRangeId: z.string(),
});

export { quizSubmitMutation };

