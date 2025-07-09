"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // For GitHub Flavored Markdown (tables, etc.)
import remarkMath from "remark-math"; // To understand the math syntax
import rehypeKatex from "rehype-katex"; // To render the math using KaTeX

// We must import the KaTeX CSS for the math to be styled correctly
import "katex/dist/katex.min.css";
import { cn } from "@/lib/utils";

// This component will now be the single source of truth for rendering markdown
export const MarkdownRenderer = ({
  content,
  className,
}: {
  content: string;
  className?: string;
}) => (
  <div
    className={cn(
      "prose dark:prose-invert max-w-none leading-relaxed",
      className
    )}
  >
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
    >
      {content}
    </ReactMarkdown>
  </div>
);
