/*
  비밀번호 포맷 검사
  영문/숫자/특수문자를 모두 포함하며 최소 8자 이상이어야 함
*/
export const isValidPassword = (password: string): boolean =>
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(password);

/*
  인증 코드 5자리인지 검사
*/
export const isFiveDigitCode = (code: string): boolean => /^\d{5}$/.test(code);

/*
  학번 유효성 검사
  - 숫자만 허용
  - 4자리 이상 10자리 이하
*/
export const isValidStudentId = (studentId: string): boolean =>
  /^\d{4,10}$/.test(studentId);

/*
  사용자 ID 포맷 검사
  영문 대소문자, 숫자, 언더바(_), 점(.)만 허용, 최소 5자 이상
*/
export const isValidUserId = (userId: string): boolean =>
  /^[A-Za-z0-9_.]{5,}$/.test(userId);
