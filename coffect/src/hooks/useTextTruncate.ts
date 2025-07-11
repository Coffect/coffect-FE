/*
author : 강신욱
description : 텍스트를 지정된 줄 수로 자르는 커스텀 훅입니다. (말줄임을 위한 훅입니다.)
              이 훅은 텍스트가 컨테이너의 최대 줄 수를 초과할 경우 텍스트를 자르고, 잘린 텍스트와 잘림 여부를 반환합니다.
              이 훅은 주로 긴 텍스트를 표시할 때 유용하며(말줄임 제공), 텍스트가 잘렸는지 여부를 확인할 수 있습니다.
*/

import { useState, useEffect, useRef, useCallback } from "react";

// 훅의 props 타입을 정의합니다.
interface UseTextTruncateProps {
  text: string; // 원본 텍스트
  maxLines: number; // 텍스트를 자를 최대 줄 수
  containerRef: React.RefObject<HTMLElement>; // 텍스트가 렌더링될 컨테이너 요소의 참조
}

// 훅이 반환할 결과 타입을 정의합니다.
interface TruncateResult {
  truncatedText: string; // 잘리거나 원본 그대로의 텍스트
  isTruncated: boolean; // 텍스트가 잘렸는지 여부
}

const useTextTruncate = ({
  text,
  maxLines,
  containerRef,
}: UseTextTruncateProps): TruncateResult => {
  // 잘린 텍스트 상태 (초기값은 원본 텍스트 -> 빈 string : 원본 텍스트 일 시 커뮤니티 페이지 전환 시 전체 텍스트가 잠깐 보이는 현상 방지)
  const [truncatedText, setTruncatedText] = useState("");
  // 텍스트가 잘렸는지 여부 상태
  const [isTruncated, setIsTruncated] = useState(false);
  // 텍스트 측정을 위한 숨겨진 canvas 요소 참조
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 텍스트의 너비와 높이를 측정하는 함수
  // canvas 2D context를 사용하여 텍스트의 픽셀 단위 크기를 정확하게 측정합니다.
  const measureText = useCallback(
    (
      textToMeasure: string, // 측정할 텍스트
      font: string, // 텍스트의 폰트 스타일 (예: "bold 16px Arial")
      containerWidth: number, // 텍스트가 들어갈 컨테이너의 너비
    ): { width: number; height: number } => {
      // canvas 요소가 없으면 새로 생성
      if (!canvasRef.current) {
        canvasRef.current = document.createElement("canvas");
      }
      const context = canvasRef.current.getContext("2d");
      if (!context) {
        return { width: 0, height: 0 };
      }
      context.font = font; // canvas context에 폰트 설정
      const metrics = context.measureText(textToMeasure); // 텍스트 측정
      // 텍스트의 실제 높이 계산 (ascender + descender)
      const actualHeight =
        metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
      // 텍스트가 컨테이너 너비를 넘어갈 경우 몇 줄을 차지하는지 계산
      const lines = Math.ceil(metrics.width / containerWidth);
      return { width: metrics.width, height: actualHeight * lines };
    },
    [],
  );

  // 텍스트를 자르는 로직
  const truncateText = useCallback(() => {
    // 컨테이너 참조가 없거나 텍스트가 없으면 원본 텍스트로 설정하고 종료
    if (!containerRef.current || !text) {
      setTruncatedText(text);
      setIsTruncated(false);
      return;
    }

    const container = containerRef.current;
    const style = getComputedStyle(container); // 컨테이너의 계산된 스타일 가져오기
    const fontSize = parseFloat(style.fontSize); // 폰트 크기
    // eslint-disable-next-line prefer-const
    let lineHeight = parseFloat(style.lineHeight); // 줄 높이

    // 줄 높이가 'normal'이거나 유효하지 않은 경우 폰트 크기의 1.2배로 대체 (일반적인 브라우저 기본값)
    const actualLineHeight =
      lineHeight === 0 || isNaN(lineHeight) ? fontSize * 1.2 : lineHeight;
    const containerWidth = container.offsetWidth; // 컨테이너의 실제 너비
    // canvas 측정을 위한 폰트 문자열 생성
    const font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;

    // 최대 허용 높이 (최대 줄 수 * 실제 줄 높이)
    const maxContentHeight = actualLineHeight * maxLines;

    // 1. 먼저 전체 텍스트가 최대 높이 안에 들어가는지 확인
    const fullTextMetrics = measureText(text, font, containerWidth);
    if (fullTextMetrics.height <= maxContentHeight) {
      setTruncatedText(text);
      setIsTruncated(false);
      return;
    }

    // 2. 텍스트가 최대 높이를 초과하면 자르기 시작
    let low = 0; // 이진 탐색을 위한 시작 인덱스
    let high = text.length; // 이진 탐색을 위한 끝 인덱스
    let bestTruncatedText = ""; // 최대 높이를 넘지 않는 가장 긴 텍스트

    // 이진 탐색을 통해 텍스트를 자를 최적의 지점을 찾습니다.
    // 텍스트를 절반씩 줄여가며 측정하여 효율적으로 탐색합니다.
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const testText = text.substring(0, mid); // 현재 테스트할 텍스트
      const metrics = measureText(testText, font, containerWidth);

      if (metrics.height <= maxContentHeight) {
        // 현재 텍스트가 최대 높이 안에 들어오면, 더 긴 텍스트를 시도
        bestTruncatedText = testText;
        low = mid + 1;
      } else {
        // 현재 텍스트가 최대 높이를 넘으면, 더 짧은 텍스트를 시도
        high = mid - 1;
      }
    }

    // 3. 최종적으로 잘린 텍스트 설정
    const suffix = "... 더보기";
    let adjustedText = bestTruncatedText;

    // "... 더보기"를 추가할 공간을 확보하기 위해 텍스트를 끝에서부터 줄여나갑니다.
    // adjustedText에 suffix를 더한 높이가 maxContentHeight를 넘지 않을 때까지 반복합니다.
    while (adjustedText.length > 0) {
      const testText = adjustedText + suffix;
      const metrics = measureText(testText, font, containerWidth);
      if (metrics.height <= maxContentHeight) {
        // 높이가 충분하면 루프를 중단합니다.
        break;
      }
      // 한 글자씩 줄여나갑니다.
      adjustedText = adjustedText.slice(0, -1);
    }

    if (adjustedText.length < text.length) {
      setTruncatedText(adjustedText + suffix);
      setIsTruncated(true); // 텍스트가 잘렸음을 표시
    } else {
      setTruncatedText(text);
      setIsTruncated(false);
    }
  }, [text, maxLines, containerRef, measureText]);

  // 컴포넌트 마운트 시 및 텍스트/창 크기 변경 시 텍스트 자르기 로직 실행
  useEffect(() => {
    truncateText(); // 초기 렌더링 시 텍스트 자르기 실행
    const handleResize = () => truncateText(); // 창 크기 변경 시 다시 자르기 실행
    window.addEventListener("resize", handleResize); // resize 이벤트 리스너 등록
    return () => window.removeEventListener("resize", handleResize); // 컴포넌트 언마운트 시 리스너 제거
  }, [truncateText]); // truncateText 함수가 변경될 때마다 useEffect 재실행

  return { truncatedText, isTruncated }; // 잘린 텍스트와 잘림 여부 반환
};

export default useTextTruncate;
