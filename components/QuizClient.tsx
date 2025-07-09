"use client";

import { useState } from "react";
import { QuizQuestion } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

interface QuizClientProps {
  questions: QuizQuestion[];
}

type AnswerStatus = "correct" | "incorrect" | "unanswered";

export default function QuizClient({ questions }: QuizClientProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [isFinished, setIsFinished] = useState(false);

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          No quiz available for this chapter yet.
        </p>
        <Button asChild variant="link" className="mt-4">
          <Link href=".">Back to Chapter</Link>
        </Button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answer: string) => {
    if (isFinished) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const calculateScore = () => {
    return questions.reduce((score, question) => {
      return selectedAnswers[question.id] === question.correctAnswer
        ? score + 1
        : score;
    }, 0);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsFinished(false);
  };

  if (isFinished) {
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Quiz Completed!</CardTitle>
          <CardDescription>
            You scored {score} out of {questions.length} ({percentage}%)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {questions.map((q, index) => {
            const userAnswer = selectedAnswers[q.id];
            const isCorrect = userAnswer === q.correctAnswer;
            return (
              <div key={q.id} className="p-4 border rounded-md">
                <p className="font-semibold">
                  {index + 1}. {q.question}
                </p>
                <p
                  className={cn(
                    "mt-2 flex items-center gap-2",
                    isCorrect ? "text-green-500" : "text-red-500"
                  )}
                >
                  {isCorrect ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <XCircle className="h-5 w-5" />
                  )}
                  Your answer: {userAnswer || "Not Answered"}
                </p>
                {!isCorrect && (
                  <p className="mt-1 text-green-600">
                    Correct answer: {q.correctAnswer}
                  </p>
                )}
              </div>
            );
          })}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={resetQuiz}>Try Again</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          Question {currentQuestionIndex + 1} / {questions.length}
        </CardTitle>
        <CardDescription className="pt-4 text-lg text-foreground">
          {currentQuestion.question}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {currentQuestion.options?.map((option) => (
          <Button
            key={option}
            variant={
              selectedAnswers[currentQuestion.id] === option
                ? "default"
                : "outline"
            }
            className="w-full justify-start h-auto py-3"
            onClick={() => handleAnswerSelect(option)}
          >
            {option}
          </Button>
        ))}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          onClick={handleNext}
          disabled={!selectedAnswers[currentQuestion.id]}
        >
          {currentQuestionIndex < questions.length - 1
            ? "Next Question"
            : "Finish Quiz"}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
}
