/* author : 흥부/강신욱
 * description : ChipGroup 컴포넌트에서 사용될 필터 데이터를 정의하는 파일입니다.
 */

/**
 * ChipGroup의 각 옵션을 나타내는 인터페이스입니다.
 */
export interface ChipOption {
  id: number; // 옵션의 고유 ID (숫자)
  value: string; // 옵션의 실제 값 (문자열, 예: "아티클", "프로덕트")
  label: string; // 사용자에게 보여질 옵션 이름
}

/**
 * 글 종류 선택을 위한 옵션 데이터입니다.
 */
export const postTypeOptions: ChipOption[] = [
  { id: 1, value: "아티클", label: "아티클 ✍🏻" },
  { id: 2, value: "팀원모집", label: "팀원 모집 👬" },
  { id: 3, value: "질문", label: "질문 👤" },
  { id: 4, value: "도움필요", label: "도움 필요 🤩" },
  { id: 5, value: "후기글", label: "후기글 ☕" },
  { id: 6, value: "팁공유", label: "팁 공유 📌" },
];

/**
 * 글 주제 선택을 위한 옵션 데이터입니다.
 */
export const postSubjectOptions: ChipOption[] = [
  { id: 1, value: "프로덕트", label: "프로덕트" },
  { id: 2, value: "개발", label: "개발" },
  { id: 3, value: "디자인", label: "디자인" },
  { id: 4, value: "기획", label: "기획" },
  { id: 5, value: "인사이트", label: "인사이트" },
  { id: 6, value: "취업", label: "취업" },
  { id: 7, value: "창업", label: "창업" },
  { id: 8, value: "학교", label: "학교" },
  { id: 9, value: "기타", label: "기타" },
];
