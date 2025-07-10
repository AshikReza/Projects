// app/subjects/[subjectSlug]/[paperSlug]/[chapterSlug]/quiz/page.tsx

import QuizClient from "@/components/QuizClient";
import { getChapterContent, getChapterDetails } from "@/lib/data-loader";

interface QuizPageParams {
  subjectSlug: string;
  paperSlug: string;
  chapterSlug: string;
}

export default async function QuizPage({
  params,
}: {
  params: Promise<QuizPageParams>;
}) {
  const { subjectSlug, paperSlug, chapterSlug } = await params;

  // We now need to fetch BOTH chapter details and questions
  const [chapter, questions] = await Promise.all([
    getChapterDetails(subjectSlug, paperSlug, chapterSlug),
    getChapterContent(subjectSlug, paperSlug, chapterSlug, "quizzes"),
  ]);

  // Pass BOTH chapter and questions to the client component
  return <QuizClient chapter={chapter} questions={questions} />;
}
