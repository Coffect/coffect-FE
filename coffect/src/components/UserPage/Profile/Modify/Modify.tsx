/*
author : 재하
description : 마이페이지 프로필 수정 폼 컴포넌트입니다.
*/

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile, patchProfile } from "@/api/profile";
import type { profileType } from "@/types/mypage/profile";
import backIcon from "@/assets/icon/mypage/back.png";
import defaultImg from "@/assets/icon/mypage/profile.png";
import editIcon from "@/assets/icon/mypage/edit.png";
import ModifyModal from "./ModifyModal";

const Modify = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // getProfile API를 useQuery로 호출
  const {
    data: profileData,
    isLoading,
    error,
  } = useQuery<profileType>({
    queryKey: ["profile"],
    queryFn: getProfile,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });

  const userInfo = profileData?.success?.userInfo;

  // 입력값 상태 관리
  const [userId, setUserId] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [userIntroduce, setUserIntroduce] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>(defaultImg);

  // userInfo가 로드되면 상태 업데이트
  useEffect(() => {
    if (userInfo) {
      setUserId(userInfo.id || "");
      setUserName(userInfo.name || "");
      setUserIntroduce(userInfo.introduce || "");
      setPreviewImage(userInfo.profileImage || defaultImg);
      setCharCount(userInfo.introduce?.length || 0);
    }
  }, [userInfo]);

  // 소개글 글자수 상태
  const [charCount, setCharCount] = useState(0);
  // 모달 상태
  const [showModifyModal, setShowModifyModal] = useState<boolean>(false);
  const [modifyMessage, setModifyMessage] = useState<string>("");

  // patchProfile API를 useMutation으로 호출
  const patchProfileMutation = useMutation({
    mutationFn: (formData: FormData) => patchProfile(formData),
    onSuccess: () => {
      // 성공 시 프로필 데이터를 다시 불러오기
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      navigate("/mypage/myprofile");
    },
    onError: (error: unknown) => {
      // 에러 처리 (아이디 중복 등)
      const axiosError = error as {
        response?: { data?: { error?: { errorCode?: string } } };
      };
      if (axiosError?.response?.data?.error?.errorCode === "EC409") {
        showMessage("이미 존재하는 아이디입니다.");
      }
    },
  });

  // 모달 메시지 표시 함수
  const showMessage = (message: string) => {
    setModifyMessage(message);
    setShowModifyModal(true);
    setTimeout(() => setShowModifyModal(false), 3000);
  };

  // 이미지 파일 선택 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 크기 검증 (5MB 이하)
      if (file.size > 5 * 1024 * 1024) {
        showMessage("파일 크기는 5MB 이하여야 합니다.");
        return;
      }

      // 파일 타입 검증
      if (!file.type.startsWith("image/")) {
        showMessage("이미지 파일만 업로드 가능합니다.");
        return;
      }

      setSelectedImage(file);

      // 미리보기 생성
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 아이디 입력 핸들러
  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 아이디 유효성 검사 (영문, 숫자, 언더스코어만 허용)
    if (/^[a-zA-Z0-9_]*$/.test(value)) {
      setUserId(value);
    }
  };

  // 이름 입력 핸들러
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 입력 중에는 자음/모음 조합을 허용하되, 한글, 영문, 공백만 허용
    if (/^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z\s]*$/.test(value)) {
      setUserName(value);
    }
  };

  // 소개글 입력 핸들러 (100자 제한)
  const handleIntroChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= 100) {
      setUserIntroduce(text);
      setCharCount(text.length);
    }
  };

  // 한글이 완성된 글자인지 확인하는 함수
  const isCompleteKorean = (text: string): boolean => {
    // 완성된 한글만 허용 (자음/모음 조합 제외)
    return /^[가-힣\s]*$/.test(text) && !/[ㄱ-ㅎㅏ-ㅣ]/.test(text);
  };

  // 저장 버튼 핸들러
  const handleSave = () => {
    // 유효성 검사
    if (!userId.trim()) {
      showMessage("아이디를 입력해주세요.");
      return;
    }
    if (!userName.trim()) {
      showMessage("이름을 입력해주세요.");
      return;
    }
    if (userId.length < 5 || userId.length > 15) {
      showMessage("아이디는 5자 이상 15자 이하로 입력해주세요.");
      return;
    }
    if (userName.length < 2 || userName.length > 7) {
      showMessage("이름은 2자 이상 7자 이하로 입력해주세요.");
      return;
    }
    if (userIntroduce.length > 100) {
      showMessage("소개글은 100자 이내로 입력해주세요.");
      return;
    }

    // 한글이 완성된 글자인지 확인
    if (!isCompleteKorean(userName.trim())) {
      showMessage("이름은 완성된 한글로 입력해주세요.");
      return;
    }

    // FormData 생성
    const formData = new FormData();

    // 값이 변경되었는지 확인하고 적절한 값 전송
    const originalId = userInfo?.id || "";
    const originalName = userInfo?.name || "";
    const originalIntroduce = userInfo?.introduce || "";

    formData.append("id", userId.trim() === originalId ? "" : userId.trim());
    formData.append(
      "name",
      userName.trim() === originalName ? "" : userName.trim(),
    );
    formData.append(
      "introduce",
      userIntroduce.trim() === originalIntroduce ? "" : userIntroduce.trim(),
    );

    // 이미지가 선택된 경우에만 추가
    if (selectedImage) {
      formData.append("img", selectedImage);
    }

    // PATCH 요청 보내기
    patchProfileMutation.mutate(formData);
  };

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-[var(--gray-5)]">
        <div className="text-lg text-[var(--gray-50)]">
          프로필을 불러오는 중...
        </div>
      </div>
    );
  }

  // 에러 상태 처리
  if (error) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-[var(--gray-5)] px-4">
        <div className="mb-4 text-lg font-bold text-[var(--gray-90)]">
          프로필을 불러오는데 실패했습니다
        </div>
        <button
          onClick={() => window.location.reload()}
          className="rounded-md bg-[var(--gray-70)] px-4 py-2 text-white"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-y-auto bg-white px-4 pb-5">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between py-3">
        <button
          className="pr-9 text-left text-3xl"
          onClick={() => navigate("/mypage/myprofile")}
        >
          <img src={backIcon} className="h-6 w-6" />
        </button>
        <div className="flex-1 items-center justify-center pr-15 text-center">
          <span className="text-lg font-semibold">
            {userInfo?.name || "사용자"}
          </span>
        </div>
      </div>

      {/* Profile Image Section: 프로필 이미지 및 버튼 */}
      <div className="flex flex-col items-center justify-center py-3">
        <div className="relative flex items-center justify-center">
          {/* Profile Image: 사용자 프로필 이미지 자리 */}
          <div className="flex h-30 w-30 overflow-hidden rounded-full border-[1.5px] border-[var(--gray-10)]">
            <img
              className="h-full w-full object-cover"
              src={previewImage}
              alt="프로필 이미지"
            />
          </div>
          {/* Edit Button: 이미지 우측 하단에 연필 아이콘 */}
          <label
            htmlFor="profile-upload"
            className="absolute right-0 bottom-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-[var(--gray-70)] transition-colors hover:bg-[var(--gray-80)]"
          >
            <img src={editIcon} className="h-6 w-6" />
          </label>
          <input
            ref={fileInputRef}
            type="file"
            id="profile-upload"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
      </div>

      {/* Form Fields: 아이디/이름/소개글 입력 */}
      {/* User ID 입력 */}
      <div className="mb-8">
        <p className="mb-1.5 text-lg font-semibold text-[var(--gray-90)]">
          아이디
        </p>
        <input
          type="text"
          value={userId}
          onChange={handleIdChange}
          className="text-md w-full rounded-lg border border-[var(--gray-10)] p-3 text-[var(--gray-90)] placeholder-[var(--gray-30)] focus:outline-none"
          placeholder="사용자 아이디를 입력하세요."
        />
      </div>

      {/* User Name 입력 */}
      <div className="mb-8">
        <p className="mb-1.5 text-lg font-semibold text-[var(--gray-90)]">
          이름
        </p>
        <input
          type="text"
          value={userName}
          onChange={handleNameChange}
          className="text-md w-full rounded-lg border border-[var(--gray-10)] p-3 text-[var(--gray-90)] placeholder-[var(--gray-30)] focus:outline-none"
          placeholder="사용자 이름을 입력하세요."
        />
      </div>

      {/* 소개 글 입력 */}
      <div>
        <p className="mb-1.5 text-lg font-semibold text-[var(--gray-90)]">
          소개 글
        </p>
        <textarea
          value={userIntroduce}
          onChange={handleIntroChange}
          className="text-md h-45 w-full resize-none rounded-lg border border-[var(--gray-10)] p-3 text-[var(--gray-90)] placeholder-[var(--gray-30)] focus:outline-none"
          rows={4}
          placeholder="나의 경력, 장점 등을 적어보세요.(100자 이내)"
        />
        {/* 글자수 카운트: textarea 외부, 오른쪽 정렬 */}
        <div className="my-1 flex justify-end text-xs text-gray-500">
          <span className="text-orange-500">{charCount}</span>
          <span>/100</span>
        </div>
      </div>

      {/* Save Button: 수정사항 저장 */}
      <div className="relative w-full">
        {/* 모달: 버튼 위에, absolute로 위치 */}
        {showModifyModal && <ModifyModal message={modifyMessage} />}
        <button
          className="w-full rounded-xl bg-[var(--gray-80)] py-3 text-lg font-semibold text-white disabled:bg-[var(--gray-30)]"
          onClick={handleSave}
          disabled={patchProfileMutation.isPending}
        >
          {patchProfileMutation.isPending ? "저장 중..." : "수정사항 저장"}
        </button>
      </div>
    </div>
  );
};

export default Modify;
