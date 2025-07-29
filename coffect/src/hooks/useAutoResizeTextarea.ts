import { useEffect } from "react";

/**
 * author: 흥부/강신욱
 * description 텍스트 입력의 양에 따라 textarea의 높이를 자동으로 조절하는 커스텀 훅
 * @param textAreaRef textarea 요소에 대한 ref
 * @param value textarea의 값
 */

const useAutoResizeTextarea = (
  textAreaRef: HTMLTextAreaElement | null,
  value: string,
) => {
  useEffect(() => {
    if (textAreaRef) {
      // 높이를 auto로 설정하여 scrollHeight가 실제 컨텐츠 높이를 반영하도록 함
      textAreaRef.style.height = "auto";
      const scrollHeight = textAreaRef.scrollHeight;
      // 계산된 scrollHeight를 textarea의 새 높이로 설정
      textAreaRef.style.height = `${scrollHeight}px`;
    }
  }, [textAreaRef, value]);
};

export default useAutoResizeTextarea;
