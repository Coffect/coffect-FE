import { axiosInstance } from "./axiosInstance";

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
