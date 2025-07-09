// app/subjects/[subjectSlug]/[paperSlug]/[chapterSlug]/quiz/page.tsx

import QuizClient from "@/components/QuizClient";
import { getChapterContent } from "@/lib/data-loader";

interface QuizPageParams {
  subjectSlug: string;
  paperSlug: string;
  chapterSlug: string;
}

export default async function QuizPage({
  params,
}: {
  // params is now a Promise that resolves to our params shape
  params: Promise<QuizPageParams>;
}) {
  // await the params promise before destructuring
  const { subjectSlug, paperSlug, chapterSlug } = await params;

  const questions = await getChapterContent(
    subjectSlug,
    paperSlug,
    chapterSlug,
    "quizzes"
  );

  return <QuizClient questions={questions} />;
}
