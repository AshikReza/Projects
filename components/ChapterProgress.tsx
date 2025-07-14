'use client';

import { useMemo } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { Progress } from '@/components/ui/progress';
import { Chapter } from '@/lib/types';

interface ChapterProgressProps {
  chapter: Chapter;
}

export default function ChapterProgress({ chapter }: ChapterProgressProps) {
  const { completed } = useProgressStore();

  const overallProgress = useMemo(() => {
    const pageTypes = ['notes', 'flashcards', 'qa', 'quiz'];
    let totalProgress = 0;

    pageTypes.forEach(pageType => {
      const totalTopics = chapter.topics.length;
      if (totalTopics === 0) return;
      const completedTopics = chapter.topics.filter(
        topic => completed[`${pageType}-${chapter.slug}-${topic.id}`]
      ).length;
      totalProgress += (completedTopics / totalTopics) * 100;
    });

    return totalProgress / pageTypes.length;
  }, [completed, chapter]);

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Chapter Progress</h2>
      <div className="bg-card border rounded-lg p-6">
        <Progress value={overallProgress} className="w-full h-3" />
        <p className="text-sm text-muted-foreground mt-2 text-center">
          {Math.round(overallProgress)}% of all materials completed
        </p>
      </div>
    </div>
  );
}