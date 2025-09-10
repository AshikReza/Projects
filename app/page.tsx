import problemsData from "@/data/problems.json";
import { ProblemCard } from "@/components/ProblemCard";

export default function Home() {
  return (
    <>
      {" "}
      <main className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          C Programming Problem Sheet
        </h1>
        <div className="space-y-8">
          {problemsData.map((category) => (
            <ProblemCard
              key={category.title}
              title={category.title}
              problems={category.problems}
            />
          ))}
        </div>
      </main>
      <footer
        className="
        py-5 text-sm 
        c-space
        bg-white text-neutral-700 
        dark:bg-black dark:text-white
      "
      >
        <div className="mx-16 sm:mx-32 md:mx-40 flex flex-wrap items-center justify-between">
          <div className="flex gap-1.5">
            <p>Terms & Conditions</p>
            <p>|</p>
            <p>Privacy Policy</p>
          </div>
          <p className="text-sm dark:text-white text-neutral-700">
            Developed with ❤️ by{" "}
            <a
              href="https://ashik-reza.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4 hover:text-primary"
            >
              Ashik
            </a>
          </p>
          <p>© 2025 | All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
