/*
author : 재하
description : 마이페이지 상세 소개 - 자기소개 질문/답변 및 대표질문 선택 컴포넌트입니다.
*/
import { useState } from "react";
import editIcon from "../../../../assets/icon/mypage/editGray.png";
import checkIcon from "../../../../assets/icon/mypage/check.png";
import detailIntroCheckIcon from "../../../../assets/icon/mypage/detailIntroCheck.png";
import detailIntroCheckedIcon from "../../../../assets/icon/mypage/detailIntroChecked.png";
import underToggleIcon from "../../../../assets/icon/mypage/underToggle.png";

const QUESTIONS = [
  { id: 1, question: "어떤 분야에서 성장하고 싶나요?" },
  { id: 2, question: "커피챗에서 나누고 싶은 이야기는?" },
  { id: 3, question: "새롭게 배워보고 싶은 분야는?" },
  { id: 4, question: "요즘 내가 가장 열중하고 있는 것은?" },
];

const MAX_MAIN = 2;
const MAX_ANSWER = 200;

const DetailIntroProfile = () => {
  // 질문/답변/대표질문 상태 관리
  const [items, setItems] = useState(
    QUESTIONS.map((q, i) => ({
      ...q,
      answer: i < 2 ? "" : "", // 초기 답변(예시)
      isOpen: false,
      isMain: false, // 초기에는 대표질문 없음
    })),
  );
  // 수정 모드 상태
  const [editMode, setEditMode] = useState(false);

  // 대표질문 개수
  const mainCount = items.filter((q) => q.isMain).length;

  // 대표질문 토글 (최대 2개)
  const handleMainToggle = (id: number) => {
    setItems((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          // 체크 해제는 무제한, 체크는 2개까지만
          if (!q.isMain && mainCount >= MAX_MAIN) return q;
          return { ...q, isMain: !q.isMain };
        }
        return q;
      }),
    );
  };

  // 답변 입력 핸들러 (200자 제한)
  const handleAnswerChange = (id: number, value: string) => {
    if (value.length > MAX_ANSWER) return;
    setItems((prev) =>
      prev.map((q) => (q.id === id ? { ...q, answer: value } : q)),
    );
  };

  // 질문 토글 펼침/접힘
  const handleToggle = (id: number) => {
    setItems((prev) =>
      prev.map((q) => (q.id === id ? { ...q, isOpen: !q.isOpen } : q)),
    );
  };

  // 저장(수정완료) 핸들러
  const handleSave = () => {
    setEditMode(false);
    setItems((prev) => prev.map((q) => ({ ...q, isOpen: false })));
  };

  return (
    <div className="mx-auto w-full max-w-xl">
      {/* 헤더: 상세 프로필 + 수정/완료 버튼 */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-end justify-start">
          <span className="text-lg font-semibold text-[var(--gray-90)]">
            ✍🏻 상세 프로필
          </span>
          {editMode && (
            <span className="ml-3 text-sm text-[var(--gray-40)]">
              최대 2개 선택
            </span>
          )}
        </div>
        <button onClick={() => (editMode ? handleSave() : setEditMode(true))}>
          {editMode ? (
            <img src={checkIcon} className="mx-1.5 h-6 w-6" />
          ) : (
            <img src={editIcon} className="mx-1.5 h-6 w-6" />
          )}
        </button>
      </div>

      {/* 뷰 모드: 대표질문 2개만 노출 */}
      {!editMode && (
        <div className="flex flex-col gap-4">
          {/* 대표질문이 없을 때 안내 메시지 */}
          {items.filter((q) => q.isMain).length === 0 ? (
            <div className="text-md text-[var(--gray-40)]">
              아직 상세 프로필이 등록되지 않았어요.
            </div>
          ) : (
            /* 대표질문만 출력 */
            items
              .filter((q) => q.isMain)
              .map((q) => (
                <div key={q.id}>
                  <div className="text-md mb-2 text-[var(--gray-40)]">
                    Q. {q.question}
                  </div>
                  <div className="text-sm text-gray-800">
                    <div className="text-md mb-2 text-[var(--gray-70)]">
                      {q.answer || <span>{"답변이 없습니다."}</span>}
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      )}

      {/* 수정 모드: 전체 질문 토글 */}
      {editMode && (
        <div className="mt-2 flex flex-col gap-2">
          {/* 전체 질문 반복 */}
          {items.map((q) => (
            <div key={q.id} className="relative">
              <div
                className={`text-md mb-2 flex items-center justify-between rounded-lg bg-[var(--gray-5)] px-4 py-2 text-[var(--gray-90)]`}
              >
                <div className="flex items-center justify-center">
                  <span className="flex items-center gap-2">
                    {q.isMain && (
                      <span className="rounded bg-[var(--gray-60)] px-2 py-0.5 text-center text-sm text-white">
                        대표
                      </span>
                    )}
                    <span className={`text-md text-[var(--gray-90)]`}>
                      Q. {q.question}
                    </span>
                  </span>
                </div>
                <button onClick={() => handleToggle(q.id)}>
                  <img src={underToggleIcon} className="h-6 w-6" />
                </button>
              </div>
              {q.isOpen && (
                <div className="mb-2 rounded bg-white py-1">
                  <textarea
                    className="text-md w-full resize-none rounded-xl border border-[var(--gray-10)] p-4 focus:outline-none"
                    rows={7}
                    maxLength={MAX_ANSWER}
                    placeholder="나의 경력, 장점 등을 적어보세요(200자 이내)"
                    value={q.answer}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  />
                  <div className="mt-1 flex items-center justify-between pl-1">
                    <div className="flex flex-row items-center gap-1">
                      <button
                        disabled={!q.isMain && mainCount >= MAX_MAIN}
                        onClick={() => handleMainToggle(q.id)}
                      >
                        {q.isMain ? (
                          <img
                            src={detailIntroCheckedIcon}
                            className="h-4 w-4"
                          />
                        ) : (
                          <img src={detailIntroCheckIcon} className="h-4 w-4" />
                        )}
                      </button>
                      <span
                        className={`text-xs ${q.isMain ? "text-[var(--startup-text)]" : "text-[var(--gray-50)]"}`}
                      >
                        대표 질문으로 설정
                      </span>
                    </div>
                    <div className="flex text-xs">
                      <span className="text-[var(--startup-text)]">
                        {q.answer.length}
                      </span>
                      <span className="text-[var(--gray-20)]">
                        /{MAX_ANSWER}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DetailIntroProfile;
