/*
author : 썬더
description : 회원가입 서비스 약관 동의
*/
import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SignupPageLayout from "./shared/SignupLayout";
import CheckboxImage from "../../assets/icon/signup/checkbox.png";
import ClickedCheckboxImage from "../../assets/icon/signup/clickCheckbox.png";
import LogoImage from "../../assets/icon/home/Logo.png";

/** 다음 단계로 이동 */
type Props = {
  onNext: () => void;
};
// 체크 박스 커스텀 디자인 컴포넌트
const ImageCheckbox = ({
  checked,
  onClick,
}: {
  checked: boolean;
  onClick: () => void;
}) => (
  <button type="button" onClick={onClick} className="mr-[1rem] h-5 w-5">
    <img
      src={checked ? ClickedCheckboxImage : CheckboxImage}
      alt={checked ? "체크됨" : "체크안됨"}
      className="h-full w-full"
    />
  </button>
);

const TermsAgreement = ({ onNext }: Props) => {
  const navigate = useNavigate();
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

  useEffect(() => {
    // 진입 시 스크롤 막기
    document.body.style.overflow = "hidden";
    return () => {
      // 컴포넌트 종료 시 스크롤 다시 허용
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <SignupPageLayout
      bottomButton={
        <button
          onClick={onNext}
          disabled={!allRequiredChecked}
          className={`w-full rounded-xl py-[4%] text-lg font-semibold ${
            allRequiredChecked
              ? "bg-[var(--gray-80)] text-[var(--gray-0)]"
              : "bg-[var(--gray-10)] text-[var(--gray-50)]"
          }`}
        >
          회원가입
        </button>
      }
    >
      {/* 로고 */}
      <img
        src={LogoImage}
        alt="coffect 로고"
        className="mb-[6%] h-8 object-contain"
      />

      {/* 타이틀 */}
      <h2 className="mb-[8%] text-2xl leading-tight font-bold text-[var(--gray-90)]">
        서비스 이용을 위해 <br />
        약관에 동의해주세요
      </h2>

      {/* 전체 동의 */}
      <div className="mb-[8%] flex w-full items-center">
        <ImageCheckbox checked={checkedAll} onClick={handleAllChange} />
        <span className="text-lg font-bold text-[var(--gray-90)]">
          모두 동의(선택 정보 포함)
        </span>
      </div>

      <div className="mb-[8%] w-full border-t border-[var(--gray-10)]" />

      {/* 필수 약관 */}
      <div className="mb-[6%] flex w-full items-center justify-between">
        <div className="flex flex-1 items-center">
          <ImageCheckbox
            checked={checkedService}
            onClick={() => setCheckedService((prev) => !prev)}
          />
          <span className="text-base font-medium text-[var(--gray-90)]">
            [필수] 서비스 이용약관 동의
          </span>
        </div>
        <button
          onClick={() => navigate("/signup/terms")}
          className="text-base font-medium text-[var(--gray-40)] underline"
        >
          보기
        </button>
      </div>

      <div className="mb-[6%] flex w-full items-center justify-between">
        <div className="flex flex-1 items-center">
          <ImageCheckbox
            checked={checkedPrivacy}
            onClick={() => setCheckedPrivacy((prev) => !prev)}
          />
          <span className="text-base font-medium text-[var(--gray-90)]">
            [필수] 개인정보 처리방침 동의
          </span>
        </div>
        <button
          onClick={() => navigate("/signup/terms")}
          className="text-base font-medium text-[var(--gray-40)] underline"
        >
          보기
        </button>
      </div>

      <div className="mb-[6%] flex w-full items-center">
        <ImageCheckbox
          checked={checkedOver14}
          onClick={() => setCheckedOver14((prev) => !prev)}
        />
        <span className="text-base font-medium text-[var(--gray-90)]">
          [필수] 만 14세 이상입니다
        </span>
      </div>

      {/* 선택 약관 */}
      <div className="mb-[6%] flex w-full items-center justify-between">
        <div className="flex flex-1 items-center">
          <ImageCheckbox
            checked={checkedMarketing}
            onClick={() => setCheckedMarketing((prev) => !prev)}
          />
          <span className="text-base font-medium text-[var(--gray-90)]">
            [선택] 마케팅 정보 수신 동의
          </span>
        </div>
        <button
          onClick={() => navigate("/signup/terms", { state: { step: 3 } })}
          className="text-base font-medium text-[var(--gray-40)] underline"
        >
          보기
        </button>
      </div>

      <div className="flex w-full items-center">
        <ImageCheckbox
          checked={checkedPush}
          onClick={() => setCheckedPush((prev) => !prev)}
        />
        <span className="text-base font-medium text-[var(--gray-90)]">
          [선택] 푸시 알림 수신 동의
        </span>
      </div>

      {/* 안내 문구 */}
      <div className="mt-[10%] w-full rounded bg-[var(--gray-5)] p-[4%]">
        <div className="mb-[2%] flex items-center space-x-1 pl-[2%] text-sm font-semibold text-[var(--gray-50)]">
          <AlertCircle className="h-4 w-4 text-gray-400" />
          <span>안전한 커피챗을 위한 조치</span>
        </div>
        <ul className="list-disc pl-[6%] text-xs leading-loose text-[var(--gray-50)]">
          <li>실명과 학교 인증이 완료된 사용자만 이용 가능</li>
          <li>선택항목 미동의 시 서비스 이용에 제한될 수 있음</li>
          <li>개인정보 보호를 위해 연락처는 자동으로 공유되지 않음</li>
        </ul>
      </div>
    </SignupPageLayout>
  );
};

export default TermsAgreement;
