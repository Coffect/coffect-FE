import { useState, useEffect } from "react";
import { axiosInstance } from "../api/axiosInstance";

export interface CoffeeChatSuggestion {
  id: string;
  suggestion: string;
  otherUserid: number;
  requestTime: string; // 제안 날짜/시간
}

export const useCoffeeChatSuggestions = () => {
  const [suggestions, setSuggestions] = useState<CoffeeChatSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = async () => {
    setLoading(true);
    setError(null);

    try {
      // 실제 API 호출 - 커피챗 제안 조회
      const response = await axiosInstance.get(
        "/home/getCoffeeChatSuggestions",
      );

      console.log("커피챗 제안 API 응답:", response.data);

      if (response.data.resultType === "SUCCESS" && response.data.success) {
        const transformedSuggestions = response.data.success.map(
          (item: unknown) => {
            const suggestion = item as {
              id?: string;
              suggestion?: string;
              otherUserid?: number;
              requestTime?: string;
            };
            return {
              id: suggestion.id || String(suggestion.otherUserid || ""),
              suggestion:
                suggestion.suggestion || "커피챗 제안이 도착했습니다.",
              otherUserid: suggestion.otherUserid || 0,
              requestTime:
                suggestion.requestTime || new Date().toLocaleString("ko-KR"),
            };
          },
        );

        console.log("변환된 제안 데이터:", transformedSuggestions);
        setSuggestions(transformedSuggestions);
      } else {
        setError("커피챗 제안을 불러올 수 없습니다.");
      }
    } catch (err) {
      console.error("커피챗 제안 조회 실패:", err);
      setError("커피챗 제안을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  return {
    suggestions,
    loading,
    error,
    refetch: fetchSuggestions,
  };
};
