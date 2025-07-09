export interface SubjectPaper {
  id: string;
  name: string;
  slug: string;
}

export interface Subject {
  id: string;
  name: string;
  slug: string;
  hasPapers: boolean;
  papers?: SubjectPaper[];
}

export interface Topic {
  id: string;
  title: string;
}

export interface Chapter {
  id: string;
  title: string;
  slug: string;
  topics: Topic[];
}

export interface NoteContent {
  [topicId: string]: string; // Markdown content
}

export interface FlashcardContent {
  id: string;
  front: string;
  back: string;
}

export interface QuizQuestion {
  id: string;
  type: 'mcq' | 'short-answer';
  question: string;
  options?: string[];
  correctAnswer: string;
}

export interface QAContent {
  id: string;
  question: string;
  answer: string;
}