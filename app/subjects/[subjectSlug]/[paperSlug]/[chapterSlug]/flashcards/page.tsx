import { getChapterContent, getChapterDetails } from "@/lib/data-loader";
import FlashcardsPageClient from "@/components/flashcard/FlashcardsPageClient";

// This interface defines the shape of the PARAMS OBJECT ITSELF
interface FlashcardsPageParams {
  subjectSlug: string;
  paperSlug: string;
  chapterSlug: string;
}

// This interface defines the full PROPS for the page.
// The key is to type `params` as a Promise that RESOLVES to our params type.
interface PageProps {
  params: Promise<FlashcardsPageParams>;
  searchParams?: { [key: string]: string | string[] | undefined };
}

// Use the PageProps interface. The function remains async.
export default async function FlashcardsPage({ params }: PageProps) {
  // CRUCIAL STEP: Await the params promise right at the start.
  // This gets the resolved object and satisfies the type-checker.
  const resolvedParams = await params;

  // Now, use the 'resolvedParams' object for all your data fetching.
  const [chapter, flashcards] = await Promise.all([
    getChapterDetails(
      resolvedParams.subjectSlug,
      resolvedParams.paperSlug,
      resolvedParams.chapterSlug
    ),
    getChapterContent(
      resolvedParams.subjectSlug,
      resolvedParams.paperSlug,
      resolvedParams.chapterSlug,
      "flashcards"
    ),
  ]);

  if (!chapter || !flashcards) {
    return <div>Content not found.</div>;
  }

  // The rest of the component remains the same
  return <FlashcardsPageClient chapter={chapter} flashcards={flashcards} />;
}
