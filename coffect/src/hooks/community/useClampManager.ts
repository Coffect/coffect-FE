/**
 * @author : 흥부/강신욱
 * @description : CSS `line-clamp`와 함께 사용하기 위한 전용 Custom Hook입니다.
 *                `useLayoutEffect`를 사용하여, 텍스트가 실제로 CSS에 의해 잘렸는지 여부를 정확하게 감지하고,
 *                '더보기'와 '접기' 상태를 관리하는 모든 로직을 캡슐화합니다.
 */

import { useState, useRef, useLayoutEffect, useCallback } from "react";

/**
 * @interface UseClampManagerOptions
 * @description : useClampManager 훅에 전달할 옵션 객체의 타입입니다.
 * @param {string} content - 훅이 감지할 텍스트 컨텐츠입니다.
 *                           이 값이 변경될 때마다 텍스트가 넘치는지 여부를 다시 계산합니다.
 */
interface UseClampManagerOptions {
  content: string;
}

/**
 * @interface UseClampManagerReturn
 * @description : useClampManager 훅이 반환하는 객체의 타입입니다.
 * @param {React.RefObject<HTMLSpanElement>} contentRef - 텍스트를 담고 있는 DOM 요소에 연결할 ref 객체입니다.
 *                                                        이 ref를 사용하여, 요소의 크기와 넘침 여부를 측정합니다.
 * @param {boolean} isClamped - 텍스트가 지정된 줄 수를 초과하여, CSS `line-clamp`가 실제로 적용되었는지를 나타내는 boolean 값입니다.
 *                             이 값이 `true`일 때만 '더보기/접기' 버튼을 표시해야 합니다.
 * @param {boolean} isExpanded - 사용자가 '더보기'를 클릭하여 전체 텍스트가 펼쳐진 상태인지를 나타내는 boolean 값입니다.
 *                             이 값이 `true`일 때는 전체 텍스트가 보이고, `false`일 때는 지정된 줄 수까지만 보입니다.
 * @param {function} handleToggle - '더보기/접기' 버튼의 `onClick` 이벤트에 연결할 토글 함수입니다.
 *                                이 함수는 사용자가 버튼을 클릭할 때마다 `isExpanded` 상태를 반전시킵니다.
 */
interface UseClampManagerReturn {
  contentRef: React.RefObject<HTMLSpanElement>;
  isClamped: boolean;
  isExpanded: boolean;
  handleToggle: (e: React.MouseEvent) => void;
}

/**
 * @param {UseClampManagerOptions} options - 훅을 설정하기 위한 옵션 객체
 * @returns {UseClampManagerReturn} - 컴포넌트에서 사용할 ref, 상태, 이벤트 핸들러
 */
const useClampManager = ({
  content,
}: UseClampManagerOptions): UseClampManagerReturn => {
  // 텍스트를 담을 DOM 요소에 연결하기 위한 ref를 생성합니다.
  const contentRef = useRef<HTMLSpanElement>(null);

  // 텍스트가 실제로 넘쳐서 잘렸는지 여부를 저장하는 상태
  const [isClamped, setIsClamped] = useState(false);
  // 사용자가 텍스트를 펼쳤는지(더보기를 눌렀는지) 여부를 저장하는 상태
  const [isExpanded, setIsExpanded] = useState(false);

  /**
   * `useCallback`으로 감싸진 이 함수는, ref로 연결된 요소의 크기를 측정하여
   * `line-clamp`가 적용되었는지 여부를 판단하고 `isClamped` 상태를 업데이트합니다.
   */
  const checkClamping = useCallback(() => {
    // ref가 아직 DOM 요소에 연결되지 않았다면, 아무 작업도 하지 않습니다.
    if (!contentRef.current) return;

    const element = contentRef.current;

    // 핵심 로직:
    // `scrollHeight`는 요소의 전체 컨텐츠 높이 (숨겨진 부분 포함)이고,
    // `clientHeight`는 요소가 화면에 실제로 차지하는 보이는 영역의 높이입니다.
    // 따라서, `scrollHeight`가 `clientHeight`보다 크다면, 내용의 일부가 숨겨져 있다는 뜻이며,
    // 이는 `line-clamp`가 성공적으로 적용되었음을 의미합니다.
    const hasOverflow = element.scrollHeight > element.clientHeight;

    // [안정성] 현재 상태와 측정된 상태가 다를 때만 상태를 업데이트하여, 불필요한 리렌더링을 방지합니다.
    if (hasOverflow !== isClamped) {
      setIsClamped(hasOverflow);
    }
  }, [isClamped]); // isClamped가 변경될 때만 함수를 재생성합니다.

  /**
   * `useEffect` 대신 `useLayoutEffect`를 사용합니다.
   * DOM이 업데이트된 직후, 브라우저가 화면을 다시 그리기 전에 동기적으로 실행되어,
   * `scrollHeight`와 같은 레이아웃 값을 가장 정확하게 측정할 수 있도록 보장합니다.
   */
  useLayoutEffect(() => {
    // 텍스트 내용이 변경되거나, 창 크기가 조절될 때마다 넘침 여부를 다시 계산합니다.
    checkClamping();

    window.addEventListener("resize", checkClamping);
    // 컴포넌트가 언마운트될 때 이벤트 리스너를 정리합니다.
    return () => window.removeEventListener("resize", checkClamping);
  }, [content, checkClamping]); // 텍스트 내용이 바뀔 때마다 효과를 재실행합니다.

  /**
   * '더보기/접기' 버튼을 위한 토글 이벤트 핸들러입니다.
   */
  const handleToggle = (e: React.MouseEvent) => {
    // 부모 요소로의 이벤트 전파를 막습니다. (예: 카드 전체 클릭 방지)
    e.stopPropagation();
    // isExpanded 상태를 현재의 반대 값으로 변경합니다 (true -> false, false -> true).
    setIsExpanded((prev) => !prev);
  };

  // [타입 문제 해결] 인터페이스와 정확히 일치하는 구조의 객체를 반환합니다.
  return { contentRef, isClamped, isExpanded, handleToggle };
};

export default useClampManager;
