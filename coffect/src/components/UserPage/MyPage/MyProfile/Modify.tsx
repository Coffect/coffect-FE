/*
author : 재하
description : 마이페이지 프로필 수정 폼 컴포넌트입니다.
*/
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Modify = () => {
  // 라우팅용 navigate
  const navigate = useNavigate();
  // 사용자 아이디 상태
  const [userId, setUserId] = useState<string>("jeha0714");
  // 사용자 이름 상태
  const [userName, setUserName] = useState<string>("재하");
  // 소개글 상태 (200자 제한)
  const [bio, setBio] = useState<string>(
    "나의 목표, 창업 등을 적어보세요!(200자 이내)",
  );
  // 소개글 글자수 상태
  const [charCount, setCharCount] = useState(bio.length);

  // 소개글 입력 핸들러 (200자 제한)
  const handleBioChange = (e: { target: { value: string } }) => {
    const text = e.target.value;
    if (text.length <= 200) {
      setBio(text);
      setCharCount(text.length);
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-white">
      {/* Header: 뒤로가기 버튼 */}
      <div className="flex items-center p-4">
        <button
          className="text-2xl"
          onClick={() => navigate("/mypage/myprofile")}
        >
          &#x25C0;
        </button>
      </div>

      {/* Profile Image Section: 프로필 이미지 및 버튼 */}
      <div className="flex items-center justify-around space-x-4 px-4 py-4 sm:space-x-6 sm:py-6">
        {/* Profile Image: 사용자 프로필 이미지 자리 */}
        <div className="h-22 w-22 rounded-full bg-black sm:h-28 sm:w-28"></div>

        {/* Buttons: 이미지 선택/기본 이미지 버튼 */}
        <div className="flex space-x-2">
          <button className="sm:text-md rounded bg-gray-800 px-2 py-2 text-sm text-white sm:px-4">
            앨범에서 선택
          </button>
          <button className="sm:text-md gray-700 rounded border border-gray-300 px-2 py-2 text-sm sm:px-4">
            기본 이미지
          </button>
        </div>
      </div>

      {/* Form Fields: 아이디/이름/소개글 입력 */}
      <div className="space-y-6 px-4">
        {/* User ID 입력 */}
        <div>
          <label className="mb-2 block font-medium text-gray-800">
            사용자 아이디
          </label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
            placeholder="사용자 아이디를 입력하세요"
          />
        </div>

        {/* User Name 입력 */}
        <div>
          <label className="mb-2 block font-medium text-gray-800">
            사용자 이름
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
            placeholder="사용자 이름을 입력하세요"
          />
        </div>

        {/* Bio 입력 */}
        <div>
          <label className="mb-2 block font-medium text-gray-800">
            소개 글
          </label>
          <div className="relative">
            <textarea
              value={bio}
              onChange={handleBioChange}
              className="w-full resize-none rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
              rows={4}
              placeholder="나의 결혼, 창업 등을 적어보세요!(200자 이내)"
            />
            {/* 글자수 카운트 */}
            <div className="absolute right-2 bottom-2 text-xs text-gray-500">
              {charCount}/200
            </div>
          </div>
        </div>
      </div>

      {/* Save Button: 수정사항 저장 */}
      <div className="px-4 py-8">
        <button className="w-full rounded-lg bg-gray-800 py-4 text-center font-medium text-white">
          수정사항 저장
        </button>
      </div>
    </div>
  );
};

export default Modify;
