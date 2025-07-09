// app/subjects/[subjectSlug]/[paperSlug]/[chapterSlug]/notes/page.tsx

import path from "path";
import { promises as fs } from "fs";
import NotesView from "@/components/NotesView";
import { getChapterContent, getChapterDetails } from "@/lib/data-loader";

export default async function NotesPage({
  params,
}: {
  params: Promise<{
    subjectSlug: string;
    paperSlug: string;
    chapterSlug: string;
  }>;
}) {
  // 1) Await the dynamic params
  const { subjectSlug, paperSlug, chapterSlug } = await params;

  // 2) Always fetch chapter metadata
  const chapter = await getChapterDetails(subjectSlug, paperSlug, chapterSlug);

  // 3) Try to load notes.json; if missing, fall back to {}
  let notes;
  try {
    notes = await getChapterContent(
      subjectSlug,
      paperSlug,
      chapterSlug,
      "notes"
    );
  } catch (err: any) {
    // If the underlying fs.readFile failed with ENOENT, we assume no notes yet.
    if (err?.code === "ENOENT") {
      console.warn(
        `No notes.json for ${subjectSlug}/${paperSlug}/${chapterSlug} — rendering empty notes.`
      );
      notes = {};
    } else {
      // Unexpected error: re-throw so Next.js can handle/log it
      throw err;
    }
  }

  return <NotesView chapter={chapter} notes={notes} />;
}
