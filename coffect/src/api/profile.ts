import { axiosInstance } from "./axiosInstance";
import type {
  profileType,
  patchProfileType,
  patchProfileInterestType,
  patchProfileDetailType,
  profileDetailItemType,
} from "@/types/mypage/profile";
import { AxiosError } from "axios";

// 나의 프로필 정보 가져오기
export const getProfile = async (): Promise<profileType> => {
  try {
    const res = await axiosInstance.get<profileType>("/profile");
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorData = axiosError.response?.data as profileType;

    if (errorData?.error?.errorCode === "EC409") {
      return axiosError.response?.data as profileType;
    }

    console.error("API 호출 중 에러 발생:", error);
    throw new Error("프로필을 불러올 수 없습니다. 다시 시도해주세요.");
  }
};

// 프로필 수정 API
export const patchProfile = async (
  formData: FormData,
): Promise<patchProfileType> => {
  try {
    const res = await axiosInstance.patch<patchProfileType>(
      "/profile",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorData = axiosError.response?.data as patchProfileType;

    // 프로필 아이디 중복된 값 예외처리
    if (errorData?.error?.errorCode === "EC409") {
      throw error;
    }

    console.error("API 호출 중 에러 발생:", error);
    throw new Error("프로필을 불러올 수 없습니다. 다시 시도해주세요.");
  }
};

// 본인 관심사 수정
export const patchProfileInterest = async (
  interestIds: number[],
): Promise<patchProfileInterestType> => {
  try {
    const res = await axiosInstance.patch<patchProfileInterestType>(
      "/profile/interest",
      { interest: interestIds },
    );
    return res.data;
  } catch (error) {
    console.error("API 호출 중 에러 발생:", error);
    throw new Error("관심사를 수정할 수 없습니다. 다시 시도해주세요.");
  }
};

// 상세 프로필 수정
export const patchProfileDetail = async (
  detailItems: profileDetailItemType[],
): Promise<patchProfileDetailType> => {
  try {
    const res = await axiosInstance.patch<patchProfileDetailType>(
      "/profile/detail",
      detailItems,
    );
    return res.data;
  } catch (error) {
    console.error("API 호출 중 에러 발생:", error);
    throw new Error("상세 프로필을 수정할 수 없습니다. 다시 시도해주세요.");
  }
};

export const getProfileSearch = async (id: string): Promise<profileType> => {
  try {
    const res = await axiosInstance.get<profileType>("/profile/search", {
      params: { id },
    });
    return res.data;
  } catch (error) {
    console.error("API 호출 중 에러 발생:", error);
    throw new Error("프로필을 불러올 수 없습니다. 다시 시도해주세요.");
  }
};
