import path from 'path';
import { promises as fs } from 'fs';
import { notFound } from 'next/navigation';
import {
  Chapter,
  FlashcardContent,
  NoteContent,
  QAContent,
  QuizQuestion,
  Subject,
} from './types';

// This is a context-aware file reader.
async function readJsonFile<T>(filePath: string): Promise<T | null> {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const fileContents = await fs.readFile(fullPath, 'utf8');
    return JSON.parse(fileContents) as T;
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code: unknown }).code !== 'ENOENT') {
      console.error(`Error processing file ${filePath}:`, error);
    }
    return null;
  }
}

// Get all subjects
export async function getSubjects(): Promise<Subject[]> {
  const subjects = await readJsonFile<Subject[]>('data/subjects.json');
  return subjects || [];
}

// Get a single subject by its slug
export async function getSubjectBySlug(slug: string): Promise<Subject> {
  const subjects = await getSubjects();
  const subject = subjects.find((s) => s.slug === slug);
  if (!subject) notFound();
  return subject;
}

// Get chapters for a specific subject and paper
export async function getChapters(
  subjectSlug: string,
  paperSlug: string
): Promise<Chapter[]> {
  const filePath = `data/${subjectSlug}/${paperSlug}/chapters.json`;
  const chapters = await readJsonFile<Chapter[]>(filePath);
  return chapters || [];
}

// Get a single chapter by its slug
export async function getChapterDetails(
  subjectSlug: string,
  paperSlug: string,
  chapterSlug: string
): Promise<Chapter> {
  const chapters = await getChapters(subjectSlug, paperSlug);
  const chapter = chapters.find((c) => c.slug === chapterSlug);
  if (!chapter) notFound();
  return chapter;
}

// Overload signatures for getChapterContent
export async function getChapterContent(
  subjectSlug: string,
  paperSlug: string,
  chapterSlug: string,
  contentType: 'notes'
): Promise<NoteContent>;
export async function getChapterContent(
  subjectSlug: string,
  paperSlug: string,
  chapterSlug: string,
  contentType: 'flashcards'
): Promise<FlashcardContent[]>;
export async function getChapterContent(
  subjectSlug: string,
  paperSlug: string,
  chapterSlug: string,
  contentType: 'quizzes'
): Promise<QuizQuestion[]>;
export async function getChapterContent(
  subjectSlug: string,
  paperSlug: string,
  chapterSlug: string,
  contentType: 'qa'
): Promise<QAContent[]>;

// Implementation
export async function getChapterContent(
  subjectSlug: string,
  paperSlug: string,
  chapterSlug: string,
  contentType: 'notes' | 'flashcards' | 'quizzes' | 'qa'
): Promise<NoteContent | FlashcardContent[] | QuizQuestion[] | QAContent[]> {
  const filePath = `data/${subjectSlug}/${paperSlug}/${chapterSlug}/${contentType}.json`;

  const content = await readJsonFile<
    NoteContent | FlashcardContent[] | QuizQuestion[] | QAContent[]
  >(filePath);

  if (content === null) {
    switch (contentType) {
      case 'notes':
        return {};
      case 'flashcards':
      case 'quizzes':
      case 'qa':
        return [];
      default:
        const exhaustiveCheck: never = contentType;
        throw new Error(`Unhandled content type: ${exhaustiveCheck}`);
    }
  }

  return content;
}