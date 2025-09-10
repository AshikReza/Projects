import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Problem {
  id: number;
  link: string;
}

interface ProblemCardProps {
  title: string;
  problems: Problem[];
}

export function ProblemCard({ title, problems }: ProblemCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {problems.map((problem) => (
            <div
              key={problem.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <span className="font-medium">Problem {problem.id}</span>
              <a href={problem.link} target="_blank" rel="noopener noreferrer">
                <Button>View</Button>
              </a>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
