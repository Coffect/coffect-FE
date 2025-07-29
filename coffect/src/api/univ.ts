import { axiosInstance } from "./axiosInstance";
import { axiosMail } from "./axiosMail";

// 대학교 검색 → 입력한 이름 기반 자동완성
export const searchUniv = async (univName: string) => {
  const res = await axiosInstance.post("/univ/search", { univName });
  return res.data.success;
};

// 특정 대학의 전공 리스트 검색
export const searchDept = async ({
  deptSearch,
  univName,
}: {
  deptSearch: string;
  univName: string;
}) => {
  const res = await axiosInstance.post("/univ/dept", {
    search: deptSearch,
    univName: univName,
  });
  return res.data.success;
};
//이메일, 학교 이름 입력 시 메일로 인증번호 5자리 전송
export const sendMailCode = async (email: string, univName: string) => {
  const response = await axiosMail.post("/univ/mail", {
    userEmail: email,
    univName,
  });
  return response.data;
};
// 사용자 입력 인증번호 5자리와 실제 메일로 보내진 인증번호 5자리 일치 여부 검증
export const verifyEmailCode = async (email: string, certCode: number) => {
  const res = await axiosInstance.post("/univ/cert", {
    email,
    certCode,
  });
  return res.data;
};
