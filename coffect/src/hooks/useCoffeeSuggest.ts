/*
  author      : 썬더
  description : 커피챗 제안 플로우 전역 훅(어디서든 재사용)
                - 제안 모달 열기/닫기, 제출, 완료 모달 열기/닫기 관리
                - postSuggestCoffeeChat API 연결
*/

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { postSuggestCoffeeChat } from "@/api/home";
import { useToastStore } from "@/hooks/useToastStore";

interface UseCoffeeSuggestReturn {
  // 상태
  isSuggestOpen: boolean;
  isCompleteOpen: boolean;
  selectedProfileId: number | null;

  // 열기/닫기/제출 핸들러
  openSuggest: (id: number) => void;
  closeSuggest: () => void;
  submitSuggest: (message: string) => void;
  closeComplete: () => void;
}

export const useCoffeeSuggest = (): UseCoffeeSuggestReturn => {
  // ===== 변수(상태) =====
  const { showToast } = useToastStore();
  const [isSuggestOpen, setIsSuggestOpen] = useState(false);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(
    null,
  );

  // ===== 제안 전송 뮤테이션 =====
  const { mutate: sendSuggest } = useMutation({
    mutationFn: async ({ message, id }: { message: string; id: number }) =>
      await postSuggestCoffeeChat(message, id),
    onSuccess: () => {
      setIsSuggestOpen(false);
      setIsCompleteOpen(true);
    },
    onError: () => {
      showToast("한 글자 이상 입력해주세요!", "error");
    },
  });

  // ===== 핸들러(함수) =====
  const openSuggest = (id: number) => {
    setSelectedProfileId(id);
    setIsSuggestOpen(true);
  };

  const closeSuggest = () => {
    setIsSuggestOpen(false);
    setSelectedProfileId(null);
  };

  const submitSuggest = (message: string) => {
    if (selectedProfileId == null) return;
    sendSuggest({ message, id: selectedProfileId });
  };

  const closeComplete = () => {
    setIsCompleteOpen(false);
    setSelectedProfileId(null);
  };

  // ===== 반환 =====
  return {
    isSuggestOpen,
    isCompleteOpen,
    selectedProfileId,
    openSuggest,
    closeSuggest,
    submitSuggest,
    closeComplete,
  };
};
