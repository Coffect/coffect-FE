/*
  이메일 포맷 검사
  @ 앞뒤에 공백과 @ 제외한 1글자 이상,
  마지막에 . 뒤에도 문자가 1글자 이상 있어야만 통과
*/
export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/*
  인증 코드 5자리인지 검사
*/
export const isFiveDigitCode = (code: string): boolean => /^\d{5}$/.test(code);
