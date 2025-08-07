// components/Signup/AgreementItem.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import CheckboxImage from "../../assets/icon/signup/checkbox.png";
import ClickedCheckboxImage from "../../assets/icon/signup/clickCheckbox.png";

interface AgreementItemProps {
  label: string;
  required?: boolean;
  checked: boolean;
  onToggle: () => void;
  showLink?: boolean;
  linkStep?: number;
}

const AgreementItem: React.FC<AgreementItemProps> = ({
  label,
  required = false,
  checked,
  onToggle,
  showLink = true,
  linkStep,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (linkStep !== undefined) {
      navigate("/signup/terms", { state: { step: linkStep } });
    } else {
      navigate("/signup/terms");
    }
  };

  return (
    <div className="mb-[6%] flex w-full items-center justify-between">
      <div className="flex flex-1 items-center">
        <button onClick={onToggle} type="button" className="mr-[1rem] h-6 w-6">
          <img
            src={checked ? ClickedCheckboxImage : CheckboxImage}
            alt={checked ? "체크됨" : "체크안됨"}
            className="h-full w-full"
          />
        </button>
        <span className="text-base font-medium text-[var(--gray-90)]">
          {required ? "[필수] " : "[선택] "}
          {label}
        </span>
      </div>
      {showLink && (
        <button
          onClick={handleClick}
          className="text-base font-medium text-[var(--gray-40)] underline"
        >
          보기
        </button>
      )}
    </div>
  );
};

export default AgreementItem;
