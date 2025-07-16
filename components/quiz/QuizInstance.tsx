// Its purpose of this component is highly specific and focused: to manage the state, logic, and UI for one complete quiz session from the first question to the final result.

// * Core Responsibilities of QuizInstance.tsx :

// ? 1/ Manages the State of a Single Session: This is its most critical job. It owns all the data that changes during a quiz.
// ! A/  currentQuestionIndex: It keeps track of which question the user is currently viewing.
// ! B/  selectedAnswers: It records every answer the user selects for each question.
// ! C/  isFinished: A simple boolean that tracks whether the quiz is active or if the user has completed it.

// ? 2/ Displays the Active Question and Options: It takes the full list of questions for the current topic, looks at currentQuestionIndex, and renders only that one question's text and answer options.

// ? 3/  Handles User Interaction: It contains the functions (handleAnswerSelect, handleNext, handlePrevious) that respond to user clicks. When you click an answer, it's QuizInstance that updates the selectedAnswers state.

// ? 4/ Controls the Quiz Flow: It determines whether to show the "Next" button or the "Finish" button. When "Finish" is clicked, it changes its own state (setIsFinished(true)) to end the game.

// ? 5/  Decides When to Show Results: When isFinished becomes true, QuizInstance stops rendering questions and instead renders the <QuizResults /> component, passing down all the necessary data (the questions, the user's answers, the calculated score) for the results component to display.

"use client";

import { useState } from "react";
import { QuizQuestion, Chapter, BilingualString } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { useProgressStore } from "@/lib/store/progressStore";

import QuizResults from "./QuizResults"; // Import the results component

interface QuizInstanceProps {
  questions: QuizQuestion[];
  chapter: Chapter;
  activeTopicId: string;
}

export default function QuizInstance({
  questions,
  chapter,
  activeTopicId,
}: QuizInstanceProps) {
  const { language } = useLanguage();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [isFinished, setIsFinished] = useState(false);
  const { completed, toggleCompletion } = useProgressStore();

  const completionSlug = `quiz-${chapter.slug}-${activeTopicId}`;
  const isCompleted = !!completed[completionSlug];

  const getText = (bilingualString: BilingualString) => {
    if (!bilingualString) return "";
    return language === "bn" ? bilingualString.bn : bilingualString.en;
  };

  const handleAnswerSelect = (answer: string) => {
    if (isFinished) return;
    const currentQuestion = questions[currentQuestionIndex];
    setSelectedAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsFinished(false);
  };

  const calculateScore = () => {
    return questions.reduce((score, question) => {
      return selectedAnswers[question.id] === question.correctAnswer.en
        ? score + 1
        : score;
    }, 0);
  };

  if (!questions || questions.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center text-muted-foreground">
          <p>No questions found for this topic.</p>
        </CardContent>
      </Card>
    );
  }

  if (isFinished) {
    return (
      <QuizResults
        questions={questions}
        selectedAnswers={selectedAnswers}
        score={calculateScore()}
        isCompleted={isCompleted}
        onReset={resetQuiz}
        onToggleCompletion={() => toggleCompletion(completionSlug)}
      />
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswerForCurrentQ = selectedAnswers[currentQuestion.id];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {language === "bn"
            ? `প্রশ্ন ${currentQuestionIndex + 1} / ${questions.length}`
            : `Question ${currentQuestionIndex + 1} / ${questions.length}`}
        </CardTitle>
        <CardDescription className="pt-4 text-lg text-foreground">
          {getText(currentQuestion.question)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {currentQuestion.options?.map((option) => (
          <Button
            key={option.en}
            variant={
              selectedAnswerForCurrentQ === option.en ? "default" : "outline"
            }
            className="w-full justify-start h-auto py-3 whitespace-normal text-left"
            onClick={() => handleAnswerSelect(option.en)}
          >
            {getText(option)}
          </Button>
        ))}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          onClick={handlePrevious}
          variant="outline"
          disabled={currentQuestionIndex === 0}
        >
          {getText({ bn: "পূর্ববর্তী", en: "Previous" })}
        </Button>
        <Button onClick={handleNext} disabled={!selectedAnswerForCurrentQ}>
          {currentQuestionIndex < questions.length - 1
            ? getText({ bn: "পরবর্তী", en: "Next" })
            : getText({ bn: "শেষ করুন", en: "Finish" })}
          <ArrowRight className="h-4 w-4 ml-2 flex-shrink-0" />
        </Button>
      </CardFooter>
    </Card>
  );
}
