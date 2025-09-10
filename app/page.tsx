import problemsData from '@/data/problems.json';
import { ProblemCard } from '@/components/ProblemCard';

export default function Home() {
  return (
    <main className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
        C Programming Problem Sheet
      </h1>
      <div className="space-y-8">
        {problemsData.map((category) => (
          <ProblemCard key={category.title} title={category.title} problems={category.problems} />
        ))}
      </div>
    </main>
  );
}