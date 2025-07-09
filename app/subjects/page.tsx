import { getSubjects } from "@/lib/data-loader";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function SubjectsPage() {
  const subjects = await getSubjects();

  return (
    <div className="container mx-auto max-w-5xl py-12 px-4">
      <h1 className="text-4xl font-bold mb-2">Select a Subject</h1>
      <p className="text-muted-foreground mb-8">
        Choose a subject to start your preparation.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <Link href={`/subjects/${subject.slug}`} key={subject.id}>
            <Card className="h-full hover:border-primary transition-colors duration-300 group">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  {subject.name}
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardTitle>
                <CardDescription>
                  {subject.hasPapers
                    ? "Contains First & Second Papers"
                    : "All chapters"}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
