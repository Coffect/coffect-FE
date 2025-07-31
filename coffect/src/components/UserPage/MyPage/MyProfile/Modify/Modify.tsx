/*
author : 재하
description : 마이페이지 프로필 수정 폼 컴포넌트입니다.
*/

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import backIcon from "../../../../../assets/icon/mypage/back.png";
import profileImg from "../../../../../assets/icon/mypage/profile.png";
import editIcon from "../../../../../assets/icon/mypage/edit.png";
import AlreadyExistIdModal from "./AlreadyExistIdModal";

const Modify = () => {
  // 라우팅용 navigate
  const navigate = useNavigate();
  // 사용자 아이디 상태
  const [userId, setUserId] = useState<string>("jeha0714");
  // 사용자 이름 상태
  const [userName, setUserName] = useState<string>("재하");
  // 소개글 상태 (100자 제한)
  const [bio, setBio] = useState<string>("일찍 일어나는 새는 피곤합니다..");
  // 소개글 글자수 상태
  const [charCount, setCharCount] = useState(bio.length);
  // 모달 상태
  const [showIdExistsModal, setShowIdExistsModal] = useState<boolean>(false);

  // 소개글 입력 핸들러 (100자 제한)
  const handleBioChange = (e: { target: { value: string } }) => {
    const text = e.target.value;
    if (text.length <= 100) {
      setBio(text);
      setCharCount(text.length);
    }
  };

  // 아이디 중복 체크 예시 (임시로 무조건 모달이 뜨도록)
  const handleSave = () => {
    setShowIdExistsModal(true);
    setTimeout(() => setShowIdExistsModal(false), 3000);
  };

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
          <span className="text-lg font-semibold">jeha0714</span>
        </div>
      </div>

      {/* Profile Image Section: 프로필 이미지 및 버튼 */}
      <div className="flex flex-col items-center justify-center py-3">
        <div className="relative flex items-center justify-center">
          {/* Profile Image: 사용자 프로필 이미지 자리 */}
          <div className="flex h-30 w-30 overflow-hidden rounded-full border-[1.5px] border-[var(--gray-10)]">
            <img src={profileImg} />
          </div>
          {/* Edit Button: 이미지 우측 하단에 연필 아이콘 */}
          <label
            htmlFor="profile-upload"
            className="absolute right-0 bottom-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-[var(--gray-70)]"
          >
            <img src={editIcon} className="h-6 w-6" />
          </label>
          <input
            type="file"
            id="profile-upload"
            className="hidden"
            accept="image/*"
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
          onChange={(e) => setUserId(e.target.value)}
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
          onChange={(e) => setUserName(e.target.value)}
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
          value={bio}
          onChange={handleBioChange}
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
        {showIdExistsModal && <AlreadyExistIdModal />}
        <button
          className="w-full rounded-xl bg-[var(--gray-80)] py-3 text-lg font-semibold text-white"
          onClick={handleSave}
        >
          수정사항 저장
        </button>
      </div>
    </div>
  );
};

export default Modify;
