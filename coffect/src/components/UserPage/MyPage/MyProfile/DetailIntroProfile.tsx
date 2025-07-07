import { useState } from "react";
import { Pencil, Check } from "lucide-react";

const QUESTIONS = [
  { id: 1, question: "어떤 분야에서 성장하고 싶나요?" },
  { id: 2, question: "커피챗에서 나누고 싶은 이야기는?" },
  { id: 3, question: "새롭게 배워보고 싶은 분야는?" },
  { id: 4, question: "요즘 내가 가장 열중하고 있는 것은?" },
];

const MAX_MAIN = 2;
const MAX_ANSWER = 200;

const DetailIntroProfile = () => {
  // 질문/답변/대표질문 상태
  const [items, setItems] = useState(
    QUESTIONS.map((q, i) => ({
      ...q,
      answer: i < 2 ? "" : "", // 초기 답변(예시)
      isOpen: false,
      isMain: i < 2, // 처음 2개만 대표질문
    })),
  );
  const [editMode, setEditMode] = useState(false);

  // 대표질문 개수
  const mainCount = items.filter((q) => q.isMain).length;

  // 대표질문 토글
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

  // 답변 입력
  const handleAnswerChange = (id: number, value: string) => {
    if (value.length > MAX_ANSWER) return;
    setItems((prev) =>
      prev.map((q) => (q.id === id ? { ...q, answer: value } : q)),
    );
  };

  // 토글 펼침/접힘
  const handleToggle = (id: number) => {
    setItems((prev) =>
      prev.map((q) => (q.id === id ? { ...q, isOpen: !q.isOpen } : q)),
    );
  };

  // 저장(수정완료)
  const handleSave = () => {
    if (items.filter((q) => q.isMain).length !== MAX_MAIN) {
      alert("대표질문 2개를 선택해주세요.");
      return;
    }
    setEditMode(false);
    setItems((prev) => prev.map((q) => ({ ...q, isOpen: false })));
  };

  return (
    <div className="mx-auto w-full max-w-xl">
      {/* 헤더 */}
      <div className="mb-2 flex items-center justify-between gap-2 text-base">
        <span className="text-base font-semibold">🎯 상세 프로필</span>
        <button
          className="ml-1 rounded p-1 text-base hover:bg-gray-100"
          onClick={() => (editMode ? handleSave() : setEditMode(true))}
          aria-label={editMode ? "수정 완료" : "수정"}
        >
          {editMode ? (
            <Check className="h-[1em] w-[1em]" />
          ) : (
            <Pencil className="h-[1em] w-[1em]" />
          )}
        </button>
      </div>

      {/* 뷰 모드: 대표질문 2개만 노출 */}
      {!editMode && (
        <div className="flex flex-col gap-4">
          {items
            .filter((q) => q.isMain)
            .map((q) => (
              <div key={q.id}>
                <div className="mb-1 text-sm font-semibold">
                  Q. {q.question}
                </div>
                <div className="text-sm whitespace-pre-line text-gray-800">
                  {q.answer || (
                    <span className="text-gray-400">답변이 없습니다.</span>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* 수정 모드: 전체 질문 토글 */}
      {editMode && (
        <div className="mt-2 flex flex-col gap-2">
          {items.map((q) => (
            <div
              key={q.id}
              className={`rounded border ${q.isMain ? "border-yellow-300 bg-yellow-200" : "border-gray-200 bg-white"}`}
            >
              {/* 토글 헤더 */}
              <button
                className="flex w-full items-center justify-between px-4 py-2 text-left"
                onClick={() => handleToggle(q.id)}
              >
                <span className="text-sm font-semibold">Q. {q.question}</span>
                <span className="text-gray-500">{q.isOpen ? "▲" : "▼"}</span>
              </button>
              {/* 토글 내용 */}
              {q.isOpen && (
                <div className="px-4 pb-3">
                  <textarea
                    className="w-full resize-none rounded border p-2 text-sm focus:border-blue-400 focus:outline-none"
                    rows={3}
                    maxLength={MAX_ANSWER}
                    placeholder="답변을 작성해주세요! (200자 이내)"
                    value={q.answer}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  />
                  <div className="mt-1 flex items-center justify-between">
                    <label className="flex cursor-pointer items-center gap-1 text-xs">
                      <input
                        type="checkbox"
                        checked={q.isMain}
                        onChange={() => handleMainToggle(q.id)}
                        disabled={!q.isMain && mainCount >= MAX_MAIN}
                      />
                      대표 질문으로 설정
                    </label>
                    <span className="text-xs text-gray-400">
                      {q.answer.length}/{MAX_ANSWER}
                    </span>
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
