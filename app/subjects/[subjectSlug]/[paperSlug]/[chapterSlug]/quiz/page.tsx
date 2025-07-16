import { getChapterContent, getChapterDetails } from "@/lib/data-loader";
import QuizPageClient from "@/components/quiz/QuizPageClient";

// Define the shape of the dynamic params
interface QuizPageParams {
  subjectSlug: string;
  paperSlug: string;
  chapterSlug: string;
}

export default async function QuizPage({ params }: { params: QuizPageParams }) {
  // Await the dynamic params API before accessing its properties
  const { subjectSlug, paperSlug, chapterSlug } = await params;

  // Fetch chapter details and quiz questions in parallel
  const [chapter, questions] = await Promise.all([
    getChapterDetails(subjectSlug, paperSlug, chapterSlug),
    getChapterContent(subjectSlug, paperSlug, chapterSlug, "quizzes"),
  ]);

  if (!chapter || !questions) {
    return <div>Quiz content not found.</div>;
  }

  // Pass data into your client component as before
  return <QuizPageClient chapter={chapter} questions={questions} />;
}
