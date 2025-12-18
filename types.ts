
export type Subject = 'math' | 'chinese' | 'none';

export interface Question {
  id: string;
  type: 'multiple-choice' | 'input';
  text: string;
  options?: string[];
  answer: string;
  hint?: string;
  visualAid?: string; // Emoji or simple description
}

export interface QuizResult {
  score: number;
  total: number;
  feedback: string;
}

export interface UserProfile {
  name: string;
  stars: number;
}
