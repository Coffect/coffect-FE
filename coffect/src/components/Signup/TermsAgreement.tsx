/*
author : 썬더
description : 회원가입 서비스 약관 동의
*/
import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";

/** 다음 단계로 이동 */
type Props = {
  onNext: () => void;
};

const TermsAgreement = ({ onNext }: Props) => {
  // 각각의 약관 체크박스 상태 관리
  const [checkedAll, setCheckedAll] = useState(false);
  const [checkedService, setCheckedService] = useState(false);
  const [checkedPrivacy, setCheckedPrivacy] = useState(false);
  const [checkedOver14, setCheckedOver14] = useState(false);
  const [checkedMarketing, setCheckedMarketing] = useState(false);
  const [checkedPush, setCheckedPush] = useState(false);
  // 필수 약관(서비스, 개인정보, 만 14세 이상) 동의 여부
  const allRequiredChecked = checkedService && checkedPrivacy && checkedOver14;
  // 약관 전체 동의 함수: 모든 약관 상태를 일괄 변경
  const handleAllChange = () => {
    const next = !checkedAll;
    setCheckedAll(next);
    setCheckedService(next);
    setCheckedPrivacy(next);
    setCheckedOver14(next);
    setCheckedMarketing(next);
    setCheckedPush(next);
  };
  // 개별 약관 체크 변경 시 전체 체크 상태 동기화
  useEffect(() => {
    const all =
      checkedService &&
      checkedPrivacy &&
      checkedOver14 &&
      checkedMarketing &&
      checkedPush;
    setCheckedAll(all);
  }, [
    checkedService,
    checkedPrivacy,
    checkedOver14,
    checkedMarketing,
    checkedPush,
  ]);

  return (
    <div className="flex min-h-screen w-full flex-col items-start justify-start bg-white px-[6%] py-[8%] text-left">
      {/* 추후 로고로 수정 예정 */}
      <h1 className="mb-[2%] text-3xl font-bold text-gray-900">coffect</h1>
      {/* 타이틀 */}
      <h2 className="mb-[10%] text-xl leading-tight font-bold">
        서비스 이용을 위해 <br />
        약관에 동의해주세요
      </h2>

      {/* 전체 동의 버튼*/}
      <label className="mb-[10%] flex w-full items-center">
        <input
          type="checkbox"
          checked={checkedAll}
          onChange={handleAllChange}
          className="mr-[1rem] aspect-square w-5 border-gray-100 accent-black"
        />
        <span className="text-lg font-semibold">모두 동의(선택 정보 포함)</span>
      </label>

      <div className="mb-[10%] w-full border-t border-gray-300" />

      {/* 필수 약관 목록 */}
      <label className="mb-[6%] flex w-full items-center justify-between">
        <div className="flex flex-1 items-center">
          <input
            type="checkbox"
            checked={checkedService}
            onChange={() => setCheckedService((prev) => !prev)}
            className="mr-[1rem] aspect-square w-5 border-gray-100 accent-black"
          />
          <span className="text-sm font-semibold">
            [필수] 서비스 이용약관 동의
          </span>
        </div>
        <button className="text-sm text-gray-400 underline">보기</button>
      </label>

      <label className="mb-[6%] flex w-full items-center justify-between">
        <div className="flex flex-1 items-center">
          <input
            type="checkbox"
            checked={checkedPrivacy}
            onChange={() => setCheckedPrivacy((prev) => !prev)}
            className="mr-[1rem] aspect-square w-5 border-gray-100 accent-black"
          />
          <span className="text-sm font-semibold">
            [필수] 개인정보 처리방침 동의
          </span>
        </div>
        <button className="text-sm text-gray-400 underline">보기</button>
      </label>

      <label className="mb-[6%] flex w-full items-center">
        <input
          type="checkbox"
          checked={checkedOver14}
          onChange={() => setCheckedOver14((prev) => !prev)}
          className="mr-[1rem] aspect-square w-5 border-gray-100 accent-black"
        />
        <span className="text-sm font-semibold">[필수] 만 14세 이상입니다</span>
      </label>

      {/* 선택 약관 목록 */}
      <label className="mb-[6%] flex w-full items-center justify-between">
        <div className="flex flex-1 items-center">
          <input
            type="checkbox"
            checked={checkedMarketing}
            onChange={() => setCheckedMarketing((prev) => !prev)}
            className="mr-[1rem] aspect-square w-5 border-gray-100 accent-black"
          />
          <span className="text-sm font-semibold">
            [선택] 마케팅 정보 수신 동의
          </span>
        </div>
        <button className="text-sm text-gray-400 underline">보기</button>
      </label>

      <label className="mb-[6%] flex w-full items-center">
        <input
          type="checkbox"
          checked={checkedPush}
          onChange={() => setCheckedPush((prev) => !prev)}
          className="mr-[1rem] aspect-square w-5 border-gray-100 accent-black"
        />
        <span className="text-sm font-semibold">
          [선택] 푸시 알림 수신 동의
        </span>
      </label>

      {/* 안내 문구 */}
      <div className="mt-[3%] mb-[10%] w-full rounded bg-gray-50 p-[4%] text-[3vw]">
        <div className="mb-[2%] flex items-center space-x-1 pl-[2%] text-sm font-semibold text-gray-800">
          <AlertCircle className="h-4 w-4 text-gray-400" />
          <span>안전한 커피챗을 위한 조치</span>
        </div>
        <ul className="list-disc pl-[6%] text-xs leading-snug text-gray-500">
          <li>실명과 학교 인증이 완료된 사용자만 이용 가능</li>
          <li>선택항목 미동의 시 서비스 이용에 제한될 수 있음</li>
          <li>개인정보 보호를 위해 연락처는 자동으로 공유되지 않음</li>
        </ul>
      </div>

      {/* 동의 버튼 */}
      <button
        onClick={onNext}
        disabled={!allRequiredChecked}
        className={`w-full rounded-xl py-[4%] text-lg text-gray-700 ${
          allRequiredChecked ? "bg-black text-white" : "bg-[#E4E4E4]"
        }`}
      >
        회원가입
      </button>
    </div>
  );
};

export default TermsAgreement;
