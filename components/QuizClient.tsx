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
import SharedSidebar from "./SharedSidebar";

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

function QuizInstance({ questions }: { questions: QuizQuestion[] }) {
  const { language } = useLanguage();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [isFinished, setIsFinished] = useState(false);

  const getText = (bilingualString: BilingualString) => {
    if (!bilingualString) return "";
    return language === "bn" ? bilingualString.bn : bilingualString.en;
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
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

  if (isFinished) {
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="space-y-8">
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
          <CardFooter className="flex justify-center">
            <Button onClick={resetQuiz}>
              {getText({ bn: "আবার চেষ্টা করুন", en: "Try Again" })}
            </Button>
          </CardFooter>
        </Card>

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
                  <CardTitle className="text-lg pr-16">
                    {`${index + 1}. ${getText(q.question)}`}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {q.options?.map((option) => {
                    const isThisTheUserAnswer = userAnswer === option.en;
                    const isThisTheCorrectAnswer =
                      q.correctAnswer.en === option.en;
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
                          state === "incorrect" &&
                            "border-red-500 bg-red-500/10",
                          state === "default" && "bg-muted/40"
                        )}
                      >
                        {state === "correct" && (
                          <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600" />
                        )}
                        {state === "incorrect" && (
                          <XCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
                        )}
                        {state === "default" && (
                          <div className="h-5 w-5 flex-shrink-0"></div>
                        )}
                        <span className="flex-grow text-sm">
                          {getText(option)}
                        </span>
                      </div>
                    );
                  })}
                </CardContent>

                {/* This section is now clean and type-safe */}
                {q.explanation && !isCorrect && (
                  <CardFooter className="bg-yellow-100/80 dark:bg-yellow-900/40 py-3">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
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
            className="w-full justify-start h-auto py-3"
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
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
}
