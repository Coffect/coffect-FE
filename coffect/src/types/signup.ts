export interface SignupData {
  email: string;
  authCode: string;
  univId: string;
  dept: string;
  studentId: string;
  id: string;
  password: string;
  name: string;
  img: string;
  interest?: string[];
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
