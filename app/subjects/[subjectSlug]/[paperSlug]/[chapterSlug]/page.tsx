// app/subjects/[subjectSlug]/[paperSlug]/[chapterSlug]/page.tsx

import { getChapterDetails } from "@/lib/data-loader";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  BookText,
  Layers,
  HelpCircle,
  ListChecks,
  ArrowRight,
} from "lucide-react";
import ChapterProgress from "@/components/ChapterProgress";

const studyMaterials = [
  {
    title: "Notes",
    description: "In-depth chapter notes",
    link: "notes",
    buttonText: "View Notes",
    icon: BookText,
  },
  {
    title: "Flash Cards",
    description: "Quick revision cards",
    link: "flashcards",
    buttonText: "View Flash Cards",
    icon: Layers,
  },
  {
    title: "Quiz",
    description: "Test your knowledge",
    link: "quiz",
    buttonText: "Start Quiz",
    icon: HelpCircle,
  },
  {
    title: "Q & A",
    description: "Common questions",
    link: "qa",
    buttonText: "View Q&A",
    icon: ListChecks,
  },
];

export default async function ChapterDetailsPage({
  params,
}: {
  params: Promise<{
    subjectSlug: string;
    paperSlug: string;
    chapterSlug: string;
  }>;
}) {
  // Await here to satisfy Next.js 15’s sync-dynamic-apis rule
  const { subjectSlug, paperSlug, chapterSlug } = await params;

  const chapter = await getChapterDetails(subjectSlug, paperSlug, chapterSlug);

  return (
    <div>
      <ChapterProgress chapter={chapter} />
      <section>
        <h2 className="text-2xl font-semibold mb-4">Study Materials</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {studyMaterials.map((material) => {
            const href = `/subjects/${subjectSlug}/${paperSlug}/${chapterSlug}/${material.link}`;
            const Icon = material.icon;
            return (
              <Card key={material.title} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="h-6 w-6 text-primary" />
                    {material.title}
                  </CardTitle>
                  <CardDescription>{material.description}</CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto">
                  <Button asChild className="w-full">
                    <Link href={href}>{material.buttonText}</Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Chapter Topics</h2>
        <Card>
          <ul className="divide-y">
            {chapter.topics.map((topic) => (
              <li
                key={topic.id}
                className="p-4 flex items-center justify-between"
              >
                <span className="font-medium">{topic.title}</span>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </div>
  );
}
