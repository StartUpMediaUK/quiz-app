"use client"

import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useQuiz } from "../_components/quiz-context";
import QuizNotFound from "../_components/quiz-not-found";

export default function ResultPage() {
  const { answers, quiz } = useQuiz();
  const router = useRouter();
  const utils = api.useUtils();
  const [submitting, setSubmitting] = useState(false);

  const submitQuiz = api.quiz.submitQuiz.useMutation({
    onSuccess: async () => {
      await utils.quiz.invalidate();
    },
  });

  if (!quiz || !quiz.objectGuid) return <QuizNotFound />;

  if (!answers || answers.length === 0) {
    router.replace(`/quiz/${quiz.slug}/start`);
    return <div>Redirecting to start...</div>;
  }

  const total = useMemo(() => answers.reduce((sum, a) => sum + a.points, 0), [answers]);
  const range = useMemo(() => quiz.version.resultRanges.find((r) => total >= r.min && total <= r.max), [quiz, total]);

  const handleGoToResults = async () => {
    if (!range) return;

    setSubmitting(true);
    try {
      await submitQuiz.mutateAsync({
        answers,
        quizId: quiz.objectGuid,
        resultRangeId: range.objectGuid,
        score: total,
      });
      toast.success("Quiz submitted successfully!");
      router.push(range.url);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit quiz, redirecting anyway.");
      router.push(range.url);
    } finally {
      setSubmitting(false);
    }
  };

  if (!range) return <div>Calculating your result...</div>;

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">
      <h2 className="text-3xl font-bold text-center">You're done!</h2>
      <p className="text-lg text-center">Click the button below to see your result.</p>
      <button
        onClick={handleGoToResults}
        disabled={submitting}
        className="px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50">
        {submitting ? "Submitting..." : "Take me to my results"}
      </button>
    </div>
  );
}
