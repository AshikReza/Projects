"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // Handles tables, strikethrough, etc.
import remarkMath from "remark-math"; // Recognizes math syntax ($...$ and $$...$$)
import rehypeKatex from "rehype-katex"; // Renders the math using the KaTeX library

// This CSS is essential for the math to look correct
import "katex/dist/katex.min.css";
import { cn } from "@/lib/utils";

export const MarkdownRenderer = ({
  content,
  className,
}: {
  content: string;
  className?: string;
}) => (
  // The 'prose-p:my-1' class reduces extra vertical space around paragraphs, making lists look tighter.
  <div
    className={cn("prose dark:prose-invert max-w-none prose-p:my-1", className)}
  >
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
    >
      {content}
    </ReactMarkdown>
  </div>
);
