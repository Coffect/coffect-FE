export interface SignupData {
  email: string;
  authCode: string;
  school: string;
  major: string;
  studentId: string;
  userid: string;
  password: string;
  username: string;
  avatar?: string;
  interests: string[];
}

export interface StepProps {
  onNext: () => void;
  onBack?: () => void;
  onUpdate?: (data: Partial<SignupData>) => void;
}
export interface LoginChoiceProps {
  onLogin: (id: string, pw: string) => void;
  onSignUp: () => void;
}
