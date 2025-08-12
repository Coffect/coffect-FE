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
  try {
    const response = await axiosMail.post("/univ/mail", {
      userEmail: email,
      univName,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to send mail code:", error);
    throw error;
  }
};
// 사용자 입력 인증번호 5자리와 실제 메일로 보내진 인증번호 5자리 일치 여부 검증
export const verifyEmailCode = async (email: string, certCode: number) => {
  try {
    const res = await axiosInstance.post("/univ/cert", {
      email,
      certCode,
    });
    return res.data;
  } catch (error) {
    console.error("Failed to verify email code:", error);
    throw error;
  }
};
// 회원가입
export const signUpRequest = async ({
  id,
  password,
  name,
  email,
  univId,
  dept,
  studentId,
  interest,
  img,
}: {
  id: string;
  password: string;
  name: string;
  email: string;
  univId: string;
  dept: string;
  studentId: string;
  interest: string;
  img: File;
}) => {
  const formData = new FormData();

  // FormData 구성
  formData.append("id", id);
  formData.append("password", password);
  formData.append("name", name);
  formData.append("email", email);
  formData.append("univId", univId);
  formData.append("dept", dept);
  formData.append("studentId", studentId);
  formData.append("interest", interest);
  formData.append("img", img);

  const response = await axiosInstance.post("/user/signup", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
