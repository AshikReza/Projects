// app/subjects/[subjectSlug]/[paperSlug]/[chapterSlug]/qa/page.tsx

import { getChapterContent } from "@/lib/data-loader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface QAPageParams {
  subjectSlug: string;
  paperSlug: string;
  chapterSlug: string;
}

export default async function QAPage({
  params,
}: {
  // mark params as a Promise of our params shape
  params: Promise<QAPageParams>;
}) {
  // await before destructuring
  const { subjectSlug, paperSlug, chapterSlug } = await params;

  const qaItems = await getChapterContent(
    subjectSlug,
    paperSlug,
    chapterSlug,
    "qa"
  );

  if (!qaItems || qaItems.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          No Q&A available for this chapter yet.
        </p>
        <Button asChild variant="link" className="mt-4">
          <Link href=".">Back to Chapter</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Accordion type="single" collapsible className="w-full">
        {qaItems.map((item) => (
          <AccordionItem value={item.id} key={item.id}>
            <AccordionTrigger className="text-left">
              {item.question}
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-base text-muted-foreground">{item.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
