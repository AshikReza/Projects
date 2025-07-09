import { getChapterContent } from "@/lib/data-loader";
import FlashcardsClient from "@/components/FlashcardsClient";

// This is a pure Server Component. Its only job is to fetch data.
// We are updating the props definition to match the Promise-based pattern used elsewhere in your app.
export default async function FlashcardsPage({
  params, // 1. Accept `params` as a whole object instead of destructuring it here.
}: {
  // 2. Type `params` as a Promise containing the slug properties.
  params: Promise<{
    subjectSlug: string;
    paperSlug: string;
    chapterSlug: string;
  }>;
}) {
  // 3. Await the params promise to get the actual values.
  const { subjectSlug, paperSlug, chapterSlug } = await params;

  // 4. Fetch the data on the server with the resolved values.
  const flashcards = await getChapterContent(
    subjectSlug,
    paperSlug,
    chapterSlug,
    "flashcards"
  );

  // 5. Render the Client Component, passing the data as props.
  return <FlashcardsClient flashcards={flashcards} />;
}
