/*
author : 썬더
description : 회원가입 서비스 약관 동의
*/
import { useState, useEffect } from "react";

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
    <div className="flex min-h-screen w-full flex-col items-start justify-start bg-white px-[6%] py-[8%] text-left text-[3.5vw]">
      {/* 타이틀 */}
      <h2 className="mb-[6%] text-[5vw] leading-tight font-bold">
        서비스 이용을 위해 <br />
        약관에 동의해주세요
      </h2>

      {/* 전체 동의 버튼*/}
      <label className="mb-[5%] flex w-full items-center">
        <input
          type="checkbox"
          checked={checkedAll}
          onChange={handleAllChange}
          className="mr-[3%] h-[5vw] w-[5vw] accent-black"
        />
        <span className="font-medium">전체 약관에 동의합니다</span>
      </label>

      <div className="mb-[5%] h-[1px] w-full bg-gray-300" />

      {/* 필수 약관 목록 */}
      <label className="mb-[4%] flex w-full items-center justify-between">
        <div className="flex flex-1 items-center">
          <input
            type="checkbox"
            checked={checkedService}
            onChange={() => setCheckedService((prev) => !prev)}
            className="mr-[3%] h-[5vw] w-[5vw] accent-black"
          />
          <span className="text-[3.5vw]">[필수] 서비스 이용약관 동의</span>
        </div>
        <button className="text-[3vw] text-gray-400 underline">보기</button>
      </label>

      <label className="mb-[4%] flex w-full items-center justify-between">
        <div className="flex flex-1 items-center">
          <input
            type="checkbox"
            checked={checkedPrivacy}
            onChange={() => setCheckedPrivacy((prev) => !prev)}
            className="mr-[3%] h-[5vw] w-[5vw] accent-black"
          />
          <span className="text-[3.5vw]">[필수] 개인정보 처리방침 동의</span>
        </div>
        <button className="text-[3vw] text-gray-400 underline">보기</button>
      </label>

      <label className="mb-[4%] flex w-full items-center">
        <input
          type="checkbox"
          checked={checkedOver14}
          onChange={() => setCheckedOver14((prev) => !prev)}
          className="mr-[3%] h-[5vw] w-[5vw] accent-black"
        />
        <span className="text-[3.5vw]">[필수] 만 14세 이상입니다</span>
      </label>

      {/* 선택 약관 목록 */}
      <label className="mb-[4%] flex w-full items-center justify-between">
        <div className="flex flex-1 items-center">
          <input
            type="checkbox"
            checked={checkedMarketing}
            onChange={() => setCheckedMarketing((prev) => !prev)}
            className="mr-[3%] h-[5vw] w-[5vw] accent-black"
          />
          <span className="text-[3.5vw]">[선택] 마케팅 정보 수신 동의</span>
        </div>
        <button className="text-[3vw] text-gray-400 underline">보기</button>
      </label>

      <label className="mb-[6%] flex w-full items-center">
        <input
          type="checkbox"
          checked={checkedPush}
          onChange={() => setCheckedPush((prev) => !prev)}
          className="mr-[3%] h-[5vw] w-[5vw] accent-black"
        />
        <span className="text-[3.5vw]">[선택] 푸시 알림 수신 동의</span>
      </label>

      {/* 안내 문구 */}
      <div className="mt-[6%] mb-[8%] w-full rounded bg-gray-50 p-[4%] text-[3vw]">
        <ul className="list-disc pl-[6%] text-[3vw] leading-relaxed text-gray-400">
          <li>약관을 모두 동의해야 회원가입과 이용 가능</li>
          <li>선택항목 미동의 시 서비스 이용에 제한 없음</li>
          <li>개인정보를 동의 없이 활용하는 일은 없습니다</li>
        </ul>
      </div>

      {/* 동의 버튼 */}
      <button
        onClick={onNext}
        disabled={!allRequiredChecked}
        className={`w-full rounded py-[4%] text-[4vw] text-white ${
          allRequiredChecked ? "bg-black" : "bg-gray-300"
        }`}
      >
        동의하고 계속하기
      </button>
    </div>
  );
};

export default TermsAgreement;
