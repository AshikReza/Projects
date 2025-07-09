import { getChapterContent } from "@/lib/data-loader";
// This is the line that has been fixed. It now points to the correct component file.
import FlashcardsClient from "@/components/FlashcardsClient";

// This is a pure Server Component. Its only job is to fetch data.
export default async function FlashcardsPage({
  params: { subjectSlug, paperSlug, chapterSlug },
}: {
  params: { subjectSlug: string; paperSlug: string; chapterSlug: string };
}) {
  // 1. Fetch the data on the server
  const flashcards = await getChapterContent(
    subjectSlug,
    paperSlug,
    chapterSlug,
    "flashcards"
  );

  // 2. Render the correct Client Component, passing the data as props.
  // This will now work without any TypeScript errors.
  return <FlashcardsClient flashcards={flashcards} />;
}
