"use client";
import { useLanguage } from "@/components/LanguageProvider";
import { MarkdownRenderer } from "./MarkdownRenderer";

// This component smartly chooses which text to show based on the global language setting
export const BilingualText = ({
  text_bn,
  text_en,
  className,
}: {
  text_bn: string;
  text_en: string;
  className?: string;
}) => {
  const { language } = useLanguage();
  const text = language === "bn" ? text_bn : text_en;
  return <MarkdownRenderer content={text} className={className} />;
};
