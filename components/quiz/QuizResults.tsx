"use client";

import { QuizQuestion, BilingualString } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { cn } from "@/lib/utils";

interface QuizResultsProps {
  questions: QuizQuestion[];
  selectedAnswers: Record<string, string>;
  score: number;
  isCompleted: boolean;
  onReset: () => void;
  onToggleCompletion: () => void;
}

export default function QuizResults({
  questions,
  selectedAnswers,
  score,
  isCompleted,
  onReset,
  onToggleCompletion,
}: QuizResultsProps) {
  const { language } = useLanguage();
  const percentage = Math.round((score / questions.length) * 100);

  const getText = (bilingualString: BilingualString) => {
    if (!bilingualString) return "";
    return language === "bn" ? bilingualString.bn : bilingualString.en;
  };

  return (
    <div className="space-y-8">
      {/* --- Main Score Card (No changes needed here) --- */}
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-3xl">
            {getText({ bn: "কুইজ সম্পন্ন!", en: "Quiz Completed!" })}
          </CardTitle>
          <CardDescription className="text-lg">
            {language === "bn"
              ? `আপনি ${questions.length} এর মধ্যে ${score} পেয়েছেন (${percentage}%)`
              : `You scored ${score} out of ${questions.length} (${percentage}%)`}
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col gap-4 justify-center">
          <Button onClick={onReset} className="whitespace-normal">
            {getText({ bn: "আবার চেষ্টা করুন", en: "Try Again" })}
          </Button>
          <Button
            onClick={onToggleCompletion}
            variant={isCompleted ? "secondary" : "default"}
          >
            {isCompleted ? "Mark as Incomplete" : "Mark as Complete"}
          </Button>
        </CardFooter>
      </Card>

      {/* --- Detailed Answer Review Section (RESTORED) --- */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">
          {getText({ bn: "ফলাফল পর্যালোচনা", en: "Review Your Answers" })}
        </h2>
        {questions.map((q, index) => {
          const userAnswer = selectedAnswers[q.id];
          const isCorrect = userAnswer === q.correctAnswer.en;

          return (
            <Card key={q.id} className="overflow-hidden relative pt-2">
              <div className="absolute top-4 right-4">
                {isCorrect ? (
                  <div
                    title="Correct"
                    className="flex items-center gap-2 text-green-600"
                  >
                    <p className="hidden sm:block font-semibold">Correct</p>
                    <CheckCircle className="h-6 w-6" />
                  </div>
                ) : (
                  <div
                    title="Incorrect"
                    className="flex items-center gap-2 text-red-600"
                  >
                    <p className="hidden sm:block font-semibold">Incorrect</p>
                    <XCircle className="h-6 w-6" />
                  </div>
                )}
              </div>

              <CardHeader>
                <CardTitle className="text-lg pr-16">{`${index + 1}. ${getText(
                  q.question
                )}`}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {q.options?.map((option) => {
                  const isThisTheUserAnswer = userAnswer === option.en;
                  const isThisTheCorrectAnswer =
                    q.correctAnswer.en === option.en;

                  // Determine the state for styling: correct, incorrect, or default
                  const state = isThisTheCorrectAnswer
                    ? "correct"
                    : isThisTheUserAnswer
                    ? "incorrect"
                    : "default";

                  return (
                    <div
                      key={option.en}
                      className={cn(
                        "flex items-center gap-4 w-full text-left p-3 rounded-lg border",
                        state === "correct" &&
                          "border-green-500 bg-green-500/10",
                        state === "incorrect" && "border-red-500 bg-red-500/10",
                        state === "default" && "bg-muted/40"
                      )}
                    >
                      {/* Add icon based on state */}
                      {state === "correct" && (
                        <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600" />
                      )}
                      {state === "incorrect" && (
                        <XCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
                      )}
                      {state === "default" && (
                        <div className="h-5 w-5 flex-shrink-0"></div> // Placeholder for alignment
                      )}
                      <span className="flex-grow text-sm">
                        {getText(option)}
                      </span>
                    </div>
                  );
                })}
              </CardContent>

              {q.explanation && !isCorrect && (
                <CardFooter className="bg-yellow-100/80 dark:bg-yellow-900/40 py-3">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <span className="font-bold">Explanation: </span>
                    {getText(q.explanation)}
                  </p>
                </CardFooter>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
