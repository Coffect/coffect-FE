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

export interface RecommendedCardResponse {
  userId: number;
  name: string;
  grade: string;
  introduce: string;
  categoryMatch: string[];
  profileImage: string;
}

export interface PastCoffeeChat {
  opponentName: string;
  color1: string;
  color2: string;
  coffeeDate: string;
}
