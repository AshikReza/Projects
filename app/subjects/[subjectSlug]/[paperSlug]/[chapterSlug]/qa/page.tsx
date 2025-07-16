// app/subjects/[subjectSlug]/[paperSlug]/[chapterSlug]/qa/page.tsx

import { getChapterContent, getChapterDetails } from "@/lib/data-loader";
import QAClient from "@/components/qa/QAClient"; // <-- Import the new client component

interface QAPageParams {
  subjectSlug: string;
  paperSlug: string;
  chapterSlug: string;
}

export default async function QAPage({
  params,
}: {
  params: Promise<QAPageParams>;
}) {
  const { subjectSlug, paperSlug, chapterSlug } = await params;

  // Fetch both chapter details (for topics) and the Q&A items
  const [chapter, qaItems] = await Promise.all([
    getChapterDetails(subjectSlug, paperSlug, chapterSlug),
    getChapterContent(subjectSlug, paperSlug, chapterSlug, "qa"),
  ]);

  // Render the new QAClient, passing all the necessary data
  return <QAClient chapter={chapter} qaItems={qaItems} />;
}
