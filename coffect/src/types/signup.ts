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
  onNext: (fields?: Partial<SignupData>) => void;
  onBack?: () => void;
  onUpdate?: (data: Partial<SignupData>) => void;
}

export interface LoginChoiceProps {
  onLogin: (id: string, pw: string) => Promise<void | string>;
  onSignUp: () => void;
}
