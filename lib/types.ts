// Base types for subjects and chapters remain the same
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

// --- NEW, POWERFUL BLOCK-BASED NOTE TYPES ---

interface BlockBase {
  type: string;
  title: string;
}

export interface DefinitionBlockType extends BlockBase {
  type: "definition";
  text_bn: string;
  text_en: string;
  examples: { bn: string; en: string }[]; // <-- Add this line
}
export interface ImportantBlockType extends BlockBase {
  type: "important";
  text_bn: string;
  text_en: string;
  examples?: { bn: string; en: string }[]; // <-- ADD THIS LINE
}
export interface SuccessBlockType extends BlockBase {
  type: "success";
  text_bn: string;
  text_en: string;
}
export interface TableBlockType extends BlockBase {
  type: "table";
  headers: string[];
  rows: string[][];
}
export interface LimitationsBlockType extends BlockBase {
  type: "limitations";
  items: { bn: string; en: string }[];
}
export interface SuccessesBlockType extends BlockBase {
  type: "successes";
  items: { bn: string; en: string }[];
}
export interface ExampleBlockType extends BlockBase {
  type: "example";
  examples: { bn: string; en: string }[];
}
export interface EquationBlockType extends BlockBase {
  type: "equation";
  equation: string;
  description_bn: string;
  description_en: string;
  examples?: { bn: string; en: string }[]; // <-- ADD THIS LINE
}

// A union of all possible block types from your JSON
export type NoteBlock =
  | DefinitionBlockType
  | TableBlockType
  | LimitationsBlockType
  | SuccessesBlockType
  | ExampleBlockType
  | EquationBlockType
  | ImportantBlockType
  | SuccessBlockType;

// A single note topic now contains a title and an array of blocks
export interface NoteTopic {
  title: string;
  blocks: NoteBlock[];
}

// The top-level NoteContent is a record mapping a topicId to its NoteTopic
export interface NoteContent {
  [topicId: string]: NoteTopic;
}

// Update the FlashcardContent interface
export interface FlashcardContent {
  id: string;
  topicId: string; // <-- Add this
  front: BilingualString; // <-- Change to BilingualString
  back: BilingualString; // <-- Change to BilingualString
}

export interface BilingualString {
  bn: string;
  en: string;
}

// Update the QuizQuestion interface
export interface QuizQuestion {
  id: string;
  topicId: string; // <-- ADD THIS LINE
  type: "mcq" | "short-answer";
  question: BilingualString;
  options?: BilingualString[];
  correctAnswer: BilingualString;
}
// Update the QAContent interface
export interface QAContent {
  id: string;
  topicId: string; // <-- ADD THIS
  question: BilingualString; // <-- UPDATE THIS
  answer: BilingualString; // <-- UPDATE THIS
}
