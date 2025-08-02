/*
  author      : 이희선
  description : 토스트 메시지 상태를 관리하는 Zustand 훅입니다.
                - showToast: 메시지 표시 (중복 호출 시 이전 타이머 제거)
                - hideToast: 즉시 토스트 숨김
*/

import { create } from "zustand";

// 토스트 메시지 타입 정의
type ToastType = "success" | "error";
// 토스트 상태 타입 정의
interface ToastState {
  message: string; // 표시할 메시지
  type: ToastType; // 메시지 타입 ("success" 또는 "error")
  visible: boolean; // 토스트 표시 여부
  timeoutId: number | null; // 타이머 ID (토스트 자동 종료용)
  showToast: (msg: string, type?: ToastType) => void; // 토스트 표시 함수
  hideToast: () => void; // 토스트 숨기기 함수
}
// Zustand로 전역 토스트 상태 생성
export const useToastStore = create<ToastState>((set, get) => ({
  message: "",
  type: "success",
  visible: false,
  timeoutId: null, // 타이머 ID 저장

  // 토스트 표시 함수
  showToast: (msg, type = "success") => {
    const { timeoutId } = get();

    // 기존 토스트가 있다면 제거(중복 방지)
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // 새 메시지 표시
    set({ message: msg, type, visible: true });

    // 새 타이머 시작(2초)
    const newTimeoutId = window.setTimeout(() => {
      set({ visible: false, timeoutId: null });
    }, 2000);
    //새 타이머 ID 저장
    set({ timeoutId: newTimeoutId });
  },
  //토스트 숨김 함수
  hideToast: () => {
    const { timeoutId } = get();
    // 타이머 존재 시 제거
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    //토스트 숨기고 타이머 초기화
    set({ visible: false, timeoutId: null });
  },
}));
