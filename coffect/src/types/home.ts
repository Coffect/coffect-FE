export interface UserProfile {
  name: string;
  major: string;
  year: string;
  tags: string[];
  intro: string;
  image: string;
  id: number;
  answers: { question: string; answer: string }[];
}
