// app/subjects/[subjectSlug]/page.tsx

import { getChapters, getSubjectBySlug, getSubjects } from "@/lib/data-loader";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

// Tell Next.js which subject slugs to prerender
export async function generateStaticParams() {
  const subjects = await getSubjects();
  return subjects.map((subject) => ({
    subjectSlug: subject.slug,
  }));
}

export default async function SubjectDetailsPage({
  params,
}: {
  // NOTE: params is now a Promise, per Next.js 15 dynamic-API changes
  params: Promise<{ subjectSlug: string }>;
}) {
  // await params before destructuring
  const { subjectSlug } = await params;

  const subject = await getSubjectBySlug(subjectSlug);

  const paperChaptersPromises =
    subject.papers?.map((paper) =>
      getChapters(subjectSlug, paper.slug).then((chapters) => ({
        paper,
        chapters,
      }))
    ) ?? [];

  const papersWithChapters = await Promise.all(paperChaptersPromises);

  return (
    <div className="container mx-auto max-w-6xl py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">{subject.name}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {papersWithChapters.map(({ paper, chapters }) => (
          <div key={paper.id}>
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
              {paper.name}
            </h2>
            {chapters.length > 0 ? (
              <div className="space-y-3">
                {chapters.map((chapter, index) => (
                  <Link
                    key={chapter.id}
                    href={`/subjects/${subjectSlug}/${paper.slug}/${chapter.slug}`}
                  >
                    <Card className="hover:bg-muted/50 transition-colors mb-5">
                      <CardContent className="p-4 flex items-center">
                        <div className="bg-primary/10 text-primary rounded-full h-10 w-10 flex items-center justify-center font-bold mr-4">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{chapter.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {chapter.topics.length} topics
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                Chapters for this paper will be added soon.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
