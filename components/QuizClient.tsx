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
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import SharedSidebar from "./SharedSidebar"; // <-- IMPORT THE SHARED COMPONENT

interface QuizClientProps {
  chapter: Chapter;
  questions: QuizQuestion[];
}

export default function QuizClient({ chapter, questions }: QuizClientProps) {
  const ALL_QUESTIONS_ID = "all";
  const [activeTopicId, setActiveTopicId] = useState(ALL_QUESTIONS_ID);

  const filteredQuestions =
    activeTopicId === ALL_QUESTIONS_ID
      ? questions
      : questions.filter((q) => q.topicId === activeTopicId);

  return (
    <div className="grid md:grid-cols-[300px_1fr] lg:grid-cols-[350px_1fr] gap-x-8 lg:gap-x-12">
      {/* A SINGLE, CLEAN CALL TO THE SHARED SIDEBAR */}
      <SharedSidebar
        chapter={chapter}
        activeTopicId={activeTopicId}
        onTopicClick={setActiveTopicId}
        showAllOption={true}
        items={questions}
        title="Quiz Topics"
      />

      <main className="min-w-0 space-y-4">
        <div className="flex justify-end">
          <LanguageSwitcher />
        </div>
        <QuizInstance key={activeTopicId} questions={filteredQuestions} />
      </main>
    </div>
  );
}

// LanguageSwitcher and QuizInstance internal components remain unchanged

// --- THIS COMPONENT IS NEWLY ADDED BACK ---
const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  return (
    <div className="flex items-center gap-2 p-1 rounded-md border bg-muted">
      <Button
        size="sm"
        variant={language === "bn" ? "secondary" : "ghost"}
        onClick={() => setLanguage("bn")}
      >
        BN
      </Button>
      <Button
        size="sm"
        variant={language === "en" ? "secondary" : "ghost"}
        onClick={() => setLanguage("en")}
      >
        EN
      </Button>
    </div>
  );
};

// The Quiz Engine Component (remains the same)
function QuizInstance({ questions }: { questions: QuizQuestion[] }) {
  const { language } = useLanguage();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [isFinished, setIsFinished] = useState(false);

  // --- NEW: Function to go to the previous question ---
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const getText = (bilingualString: BilingualString) => {
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

  const calculateScore = () => {
    return questions.reduce((score, question) => {
      return selectedAnswers[question.id] === question.correctAnswer.en
        ? score + 1
        : score;
    }, 0);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsFinished(false);
  };

  if (!questions || questions.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center text-muted-foreground">
          <p>
            {getText({
              bn: "এই টপিকের জন্য কোনো প্রশ্ন পাওয়া যায়নি।",
              en: "No questions found for this topic.",
            })}
          </p>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswerForCurrentQ = selectedAnswers[currentQuestion.id];

  if (isFinished) {
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">
            {getText({ bn: "কুইজ সম্পন্ন!", en: "Quiz Completed!" })}
          </CardTitle>
          <CardDescription>
            {language === "bn"
              ? `আপনি ${questions.length} এর মধ্যে ${score} পেয়েছেন (${percentage}%)`
              : `You scored ${score} out of ${questions.length} (${percentage}%)`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {questions.map((q, index) => {
            const userAnswer = selectedAnswers[q.id];
            const isCorrect = userAnswer === q.correctAnswer.en;
            return (
              <div key={q.id} className="p-4 border rounded-md">
                <p className="font-semibold">
                  {index + 1}. {getText(q.question)}
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
                  {getText({ bn: "আপনার উত্তর:", en: "Your answer:" })}{" "}
                  {userAnswer ||
                    getText({ bn: "উত্তর দেননি", en: "Not Answered" })}
                </p>
                {!isCorrect && (
                  <p className="mt-1 text-green-600">
                    {getText({ bn: "সঠিক উত্তর:", en: "Correct answer:" })}{" "}
                    {getText(q.correctAnswer)}
                  </p>
                )}
              </div>
            );
          })}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={resetQuiz}>
            {getText({ bn: "আবার চেষ্টা করুন", en: "Try Again" })}
          </Button>
        </CardFooter>
      </Card>
    );
  }

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
            className="w-full justify-start h-auto py-3"
            onClick={() => handleAnswerSelect(option.en)}
          >
            {getText(option)}
          </Button>
        ))}
      </CardContent>
      {/* --- START OF THE FOOTER FIX --- */}
      <CardFooter className="flex justify-between">
        <Button
          onClick={handlePrevious}
          variant="outline"
          disabled={currentQuestionIndex === 0} // Disable on the first question
        >
          {getText({ bn: "পূর্ববর্তী", en: "Previous" })}
        </Button>
        <Button onClick={handleNext} disabled={!selectedAnswerForCurrentQ}>
          {currentQuestionIndex < questions.length - 1
            ? getText({ bn: "পরবর্তী", en: "Next" })
            : getText({ bn: "শেষ করুন", en: "Finish" })}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
      {/* --- END OF THE FOOTER FIX --- */}
    </Card>
  );
}
