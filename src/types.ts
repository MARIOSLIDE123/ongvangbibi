export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface FlowerPart {
  id: string;
  name: string;
  vietnameseName: string;
  description: string;
  kidsExplanation: string;
  roleInReproduction: string;
  color: string;
}

export interface FlowerGameItem {
  id: string;
  name: string;
  type: "luong_tinh" | "don_tinh";
  emoji: string;
  description: string;
  explanation: string;
}

export interface LessonStage {
  id: number;
  title: string;
  subtitle: string;
  description: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  emoji: string;
}

export interface StudentInfo {
  name: string;
  className: string;
  school: string;
}

export interface Attempt {
  id: string;
  timestamp: string;
  studentInfo: StudentInfo;
  scores: {
    stage1: number;
    stage2: number;
    stage3: number;
    stage4: number;
    stage5: number;
  };
  totalScore: number;
}

export interface QuizQuestion {
  id: number;
  type: "single" | "multiple" | "fill" | "select";
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  placeholder?: string;
}
