import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Modify = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string>("jeha0714");
  const [userName, setUserName] = useState<string>("재하");
  const [bio, setBio] = useState<string>(
    "나의 목표, 창업 등을 적어보세요!(200자 이내)",
  );
  const [charCount, setCharCount] = useState(bio.length);

  const handleBioChange = (e: { target: { value: string } }) => {
    const text = e.target.value;
    if (text.length <= 200) {
      setBio(text);
      setCharCount(text.length);
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-white">
      {/* Header */}
      <div className="flex items-center p-4">
        <button
          className="text-2xl"
          onClick={() => navigate("/mypage/myprofile")}
        >
          &#x25C0;
        </button>
      </div>

      {/* Profile Image Section */}
      <div className="flex items-center justify-around space-x-4 px-4 py-4 sm:space-x-6 sm:py-6">
        {/* Profile Image */}
        <div className="h-22 w-22 rounded-full bg-black sm:h-28 sm:w-28"></div>

        {/* Buttons */}
        <div className="flex space-x-2">
          <button className="sm:text-md rounded bg-gray-800 px-2 py-2 text-sm text-white sm:px-4">
            앨범에서 선택
          </button>
          <button className="sm:text-md gray-700 rounded border border-gray-300 px-2 py-2 text-sm sm:px-4">
            기본 이미지
          </button>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-6 px-4">
        {/* User ID */}
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

        {/* User Name */}
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

        {/* Bio */}
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
            <div className="absolute right-2 bottom-2 text-xs text-gray-500">
              {charCount}/200
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="px-4 py-8">
        <button className="w-full rounded-lg bg-gray-800 py-4 text-center font-medium text-white">
          수정사항 저장
        </button>
      </div>
    </div>
  );
};

export default Modify;
