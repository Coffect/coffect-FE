export interface SignupData {
  email: string;
  univId: string;
  dept: string;
  studentId: string;
  id: string;
  password: string;
  name: string;
  img: File;
  interest?: string;
  selectedSchoolName: string;
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
