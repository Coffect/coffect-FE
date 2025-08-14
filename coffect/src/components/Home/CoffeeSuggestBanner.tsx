/*
  author      : 이희선
  description : 커피챗 제안 배너 (FCM만으로 수신/표시)
                - FCM/ServiceWorker에서 수신한 payload를 카드 형태로 표시
                - 카드 표시/삭제용 식별자(cardId)와 서버 조회용 식별자(coffectId) 분리
                - 모달에는 coffectId를 전달하여 최신 메시지 조회, 삭제는 cardId로 일관 처리
*/

import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useRef, useState } from "react";
import "swiper/css";
import { Swiper as SwiperClass } from "swiper";
import MessageModal from "./MessageModal";
import DeleteSuggestModal from "./DeleteSuggestModal";
import { useNavigate } from "react-router-dom";
import NoSuggestImage from "../../assets/icon/home/NoSuggest.png";

// FCM 포그라운드 수신
import { onMessageListener, type FcmPayload } from "@/utils/fcm";
// 프로필 라우팅용: 숫자 기반 유저 ID → 문자열 ID 변환 API
import { acceptCoffeeChat, getUserStringId } from "@/api/home";
import { createChatRoom } from "@/api/chat";
import CoffeeSuggestResponseModal from "./CoffeeSuggestResponseModal";

/* --------------------------------- 타입 --------------------------------- */

/** 배너에 표시되는 제안 카드의 데이터 구조
 *  - cardId     : 화면 표시/삭제를 위한 안정적인 식별자 (string)
 *  - coffectId  : 서버에서 최신 메시지를 조회할 때 사용하는 실제 ID (number|null)
 *  - userPageId : 프로필 화면 라우팅을 위해 숫자 기반 유저 ID를 보관 (string|number)
 */
interface Suggestion {
  cardId: string;
  coffectId?: number | null;
  name: string;
  message: string;
  image: string;
  userId?: string;
  userPageId?: string | number;
}

/** 서비스워커 postMessage 수신 타입 (단건/배열 모두 수용) */
type SwPostMessage =
  | { source?: string; payload?: FcmPayload; payloads?: FcmPayload[] }
  | FcmPayload;

/** FCM payload 판별을 위한 타입 가드 */
const isFcmPayload = (x: unknown): x is FcmPayload =>
  !!x &&
  typeof x === "object" &&
  ("data" in (x as Record<string, unknown>) ||
    "notification" in (x as Record<string, unknown>));

/* --------------------------- 변환 유틸리티 함수 --------------------------- */

/** FCM payload → Suggestion 변환
 *  - 다양한 키 네이밍(coffectId / coffeeChatId / coffeeid)을 흡수
 *  - UI 식별자(cardId)와 서버 조회용(coffectId) 분리
 *  - 알림 본문/이미지가 없는 경우 기본값 적용
 */
const toSuggestion = (payload: FcmPayload): Suggestion | null => {
  const data = payload.data ?? {};
  if (data.type !== "coffee_chat_proposal") return null;

  // 서버 조회용 원본 식별자 추출
  const coffectIdRaw =
    (data.coffectId as string | number | undefined) ??
    (data.coffeeChatId as string | number | undefined) ??
    (data.coffeeid as string | number | undefined);

  // number 변환 가능 시에만 coffectId로 사용
  const coffectIdNum =
    coffectIdRaw != null && !Number.isNaN(Number(coffectIdRaw))
      ? Number(coffectIdRaw)
      : null;

  // 카드 표시/삭제용 식별자: 원본 값이 없으면 타임스탬프로 대체
  const cardId = String(coffectIdRaw ?? Date.now());

  // 표시용 텍스트/이미지 정리
  const name = (data.firstUserName as string) ?? "알 수 없음";
  const message =
    (payload.notification?.body as string) ?? "커피챗 제안이 도착했어요!";
  const image = (payload.notification?.image as string) ?? "/favicon.ico";

  return {
    cardId,
    coffectId: coffectIdNum,
    name,
    message,
    image,
    userId: data.userId ? String(data.userId) : undefined,
    userPageId: data.firstUserId,
  };
};

/* -------------------------------- 컴포넌트 ------------------------------- */

const CoffeeSuggestBanner: React.FC = () => {
  /* ------------------------------ 변수(상태) ------------------------------ */
  const swiperRef = useRef<SwiperClass | null>(null);
  const navigate = useNavigate();

  /** 화면에 표시할 제안 카드 목록
   *  - 가장 최근 수신 항목이 앞에 오도록 prepend
   *  - 동일 cardId 중복 추가 방지
   */
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  /** 모달/삭제 상태 */
  const [checkedMessage, setCheckedMessage] = useState<Suggestion | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null); // cardId 보관
  const [isMessageHidden, setIsMessageHidden] = useState(false);
  /** 수락 결과 알림 모달 상태 **/
  const [acceptNotice, setAcceptNotice] = useState<{
    open: boolean;
    userName: string;
    chatId?: number;
  } | null>(null);

  /* ------------------------------ 함수 선언부 ------------------------------ */

  /** 새로운 FCM payload를 Suggestion으로 변환하여 목록에 추가
   *  - 변환 실패(null) 시 무시
   *  - cardId 기준으로 중복을 막고, 새 항목을 맨 앞에 추가
   */
  const pushSuggestion = (p: FcmPayload) => {
    const s = toSuggestion(p);
    if (!s) return;
    setSuggestions((prev) =>
      prev.some((v) => v.cardId === s.cardId) ? prev : [s, ...prev],
    );
  };

  /** 모달 닫기 공통 처리 */
  const handleClose = () => {
    setCheckedMessage(null);
    setPendingDeleteId(null);
    setIsMessageHidden(false);
  };

  /** 삭제 요청 시작: 모달 내용 잠시 숨김 + 삭제 대상 cardId 보관 */
  const handleDeleteRequest = (id: string) => {
    setIsMessageHidden(true);
    setPendingDeleteId(id);
  };

  /** 삭제 확인: 현재 목록에서 일치하는 cardId 제거 후 상태 초기화 */
  const handleConfirmDelete = () => {
    if (pendingDeleteId != null) {
      setSuggestions((prev) =>
        prev.filter((s) => s.cardId !== pendingDeleteId),
      );

      // ★ SW 저장분 삭제 요청
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.ready.then((reg) => {
          reg.active?.postMessage({
            type: "fcm-delete",
            cardId: pendingDeleteId,
          });
        });
      }

      setCheckedMessage(null);
      setPendingDeleteId(null);
      setIsMessageHidden(false);
    }
  };

  /** 삭제 취소: 숨김 해제 + 대상 해제 */
  const handleCancelDelete = () => {
    setIsMessageHidden(false);
    setPendingDeleteId(null);
  };

  // 안전 접근 헬퍼 (any 금지)
  const get = (o: unknown, k: string): unknown =>
    o && typeof o === "object" && k in (o as Record<string, unknown>)
      ? (o as Record<string, unknown>)[k]
      : undefined;

  // 응답/실패 포맷 모두에서 채팅방 ID 회수
  const pickIdFromResponse = (res: unknown): string | number | undefined => {
    // 성공 응답: { success: { chatRoomId } }
    const idFromSuccess = get(get(res, "success"), "chatRoomId");
    if (
      typeof idFromSuccess === "string" ||
      typeof idFromSuccess === "number"
    ) {
      return idFromSuccess;
    }
    // 실패(409) 응답: { error: { errorCode: "EC409", data } }
    const err = get(res, "error");
    const code = get(err, "errorCode");
    const data = get(err, "data");
    if (
      code === "EC409" &&
      (typeof data === "string" || typeof data === "number")
    ) {
      return data;
    }
    return undefined;
  };

  // AxiosError에서 409 ID 회수
  const pickIdFromAxiosError = (err: unknown): string | number | undefined => {
    const status = get(get(err, "response"), "status");
    if (status !== 409) return undefined;
    const data = get(get(get(get(err, "response"), "data"), "error"), "data");
    return typeof data === "string" || typeof data === "number"
      ? data
      : undefined;
  };

  /** 대화 시작: 채팅 화면으로 이동 후 모달 닫기 */
  const handleChat = async () => {
    if (!checkedMessage) return;

    try {
      //  수락하여 채팅 목록에 띄울 수 있도록 해줌.
      if (typeof checkedMessage.coffectId === "number") {
        try {
          await acceptCoffeeChat(checkedMessage.coffectId);
        } catch (e) {
          console.warn("acceptCoffeeChat 실패", e);
        }
      } else {
        console.warn("coffectId 없음");
      }

      const res = await createChatRoom(checkedMessage.userPageId as number);

      // 200(성공) 또는 서버가 FAIL로 돌려줘도 여기서 먼저 시도
      const id = pickIdFromResponse(res);
      if (id !== undefined) {
        navigate(`/chat/${id}`);
      } else {
        console.error("채팅방 ID를 가져올 수 없습니다.", res);
        navigate("/chat");
      }
    } catch (err) {
      // Axios가 409를 throw한 경우 여기서 회수
      const id409 = pickIdFromAxiosError(err);
      if (id409 !== undefined) {
        navigate(`/chat/${id409}`);
      } else {
        navigate("/chat");
      }
    } finally {
      handleClose();
    }
  };

  /* ------------------------------ 사이드이펙트 ------------------------------ */

  // 1) FCM 포그라운드 메시지 수신
  useEffect(() => {
    //수락 결과(요청 보낸 사람에게 가는 알림) 분기
    const unsub = onMessageListener((payload) => {
      const type = payload?.data?.type;
      if (type === "ACCEPT_RESULT") {
        const userName = (payload.data?.secondUserName as string) ?? "상대방";
        const raw = payload.data?.chatId as string | number | undefined;
        const chatId =
          raw != null && !Number.isNaN(Number(raw)) ? Number(raw) : undefined;

        setAcceptNotice({ open: true, userName, chatId });
        return;
      }
      pushSuggestion(payload);
    });
    return () => unsub?.();
  }, []);

  // 2) 서비스워커 → 페이지 postMessage 수신
  //    - 단건/배열 모두 처리
  //    - 초기 진입 시 SW에게 캐시된 payload flush 요청
  useEffect(() => {
    const onSwMessage = (ev: MessageEvent<SwPostMessage>) => {
      if (isFcmPayload(ev.data) && ev.data?.data?.type === "ACCEPT_RESULT") {
        const userName = (ev.data.data?.secondUserName as string) ?? "상대방";
        const raw = ev.data.data?.chatId as string | number | undefined;
        const chatId =
          raw != null && !Number.isNaN(Number(raw)) ? Number(raw) : undefined;
        setAcceptNotice({ open: true, userName, chatId });
        return;
      }
      if (isFcmPayload(ev.data)) {
        pushSuggestion(ev.data);
        return;
      }
      if (ev.data && typeof ev.data === "object") {
        const single = (ev.data as { payload?: FcmPayload }).payload;
        const many = (ev.data as { payloads?: FcmPayload[] }).payloads;
        if (single) {
          if (single?.data?.type === "ACCEPT_RESULT") {
            const userName =
              (single.data?.secondUserName as string) ?? "상대방";
            const raw = single.data?.chatId as string | number | undefined;
            const chatId =
              raw != null && !Number.isNaN(Number(raw))
                ? Number(raw)
                : undefined;
            setAcceptNotice({ open: true, userName, chatId });
            return;
          }
          pushSuggestion(single);
        }
        if (Array.isArray(many)) many.forEach(pushSuggestion);
      }
    };

    const hasSW =
      typeof navigator !== "undefined" && "serviceWorker" in navigator;

    if (hasSW && navigator.serviceWorker) {
      navigator.serviceWorker.addEventListener("message", onSwMessage);
    }
    window.addEventListener("message", onSwMessage);

    (async () => {
      if (!hasSW) return;
      const reg = await navigator.serviceWorker
        .getRegistration()
        .catch(() => null);
      reg?.active?.postMessage({ type: "fcm-flush" });
    })();

    return () => {
      if (hasSW && navigator.serviceWorker) {
        navigator.serviceWorker.removeEventListener("message", onSwMessage);
      }
      window.removeEventListener("message", onSwMessage);
    };
  }, []);

  // 3) SW 제어권 획득 타이밍 보강
  //    - controller가 없던 상태에서 생기는 시점(controllerchange)에 맞춰 flush 재요청
  useEffect(() => {
    const hasSW =
      typeof navigator !== "undefined" && "serviceWorker" in navigator;

    const flush = async () => {
      if (!hasSW) return;
      const reg = await navigator.serviceWorker
        .getRegistration()
        .catch(() => null);
      reg?.active?.postMessage({ type: "fcm-flush" });
    };

    if (hasSW && navigator.serviceWorker?.controller) {
      // 이미 제어권이 있으면 즉시 flush
      flush();
    } else if (hasSW) {
      // 제어권이 생기는 순간을 기다렸다가 flush
      const onCtrl = () => {
        flush();
        navigator.serviceWorker.removeEventListener("controllerchange", onCtrl);
      };
      navigator.serviceWorker.addEventListener("controllerchange", onCtrl);
    }
  }, []);

  /* --------------------------------- 렌더 --------------------------------- */

  const hasSuggestions = suggestions.length > 0;

  return (
    <div className="mt-[2%] flex w-full items-center justify-center overflow-hidden">
      <div className="flex h-auto w-full">
        {/* 제안이 없을 때: 안내 카드 + 일러스트 */}
        {!hasSuggestions ? (
          <div className="relative w-full items-center justify-center">
            <div className="rounded-[20px] bg-white px-[6%] py-[7%] text-left text-base leading-normal font-medium text-[var(--gray-50)] shadow-[0_0_20px_rgba(189,179,170,0.2)]">
              아직{" "}
              <span className="text-[var(--gray-90)]">
                커피챗 제안이 오지 않았어요!
              </span>
              <br />
              먼저 제안해보는 건 어때요?
            </div>
            <img
              src={NoSuggestImage}
              alt="제안 없음"
              className="absolute right-2 bottom-0 w-[98px]"
            />
          </div>
        ) : (
          // 제안이 있을 때: 스와이퍼로 카드 슬라이드
          <Swiper
            className="h-auto w-full"
            spaceBetween={16}
            slidesPerView={1}
            onSwiper={(sw) => (swiperRef.current = sw)}
          >
            {suggestions.map((user) => (
              <SwiperSlide
                key={user.cardId}
                className="flex items-center justify-center"
              >
                <div className="flex w-full items-center gap-[12px] rounded-[20px] bg-white px-[5%] py-[4%] shadow-[0_0_20px_rgba(189,179,170,0.2)]">
                  {/* 프로필 이미지 */}
                  <img
                    src={user.image}
                    alt="프로필 사진"
                    className="aspect-[1/1] w-[18%] rounded-full object-cover"
                  />

                  {/* 텍스트/버튼 영역 */}
                  <div className="flex w-0 flex-1 flex-col justify-center">
                    <p className="mb-[3%] ml-[3%] overflow-hidden text-base font-medium text-[var(--gray-70)]">
                      <span className="text-base font-bold text-[var(--gray-85)]">
                        {user.name}
                      </span>
                      님의 {user.message}
                    </p>

                    <div className="ml-[3%] flex justify-start">
                      {/* 프로필 보기: 숫자 ID → 문자열 ID 변환 후 라우팅 */}
                      <button
                        onClick={async () => {
                          const n = Number(user.userPageId);
                          if (Number.isNaN(n)) {
                            console.warn(
                              "userPageId가 숫자가 아닙니다:",
                              user.userPageId,
                            );
                            return;
                          }
                          try {
                            const stringId = await getUserStringId(n);
                            navigate(`/userpage/${stringId}`);
                          } catch (e) {
                            console.warn("getUserStringId 실패:", e);
                          }
                        }}
                        className="rounded-[12px] bg-[var(--gray-80)] px-4 py-1.5 text-base font-medium text-[var(--gray-0)]"
                      >
                        프로필 보기
                      </button>

                      {/* 메시지 확인: 모달 열기 */}
                      <button
                        onClick={() => setCheckedMessage(user)}
                        className="ml-[3%] rounded-[12px] border-[1.5px] border-[var(--gray-20)] bg-[var(--gray-0)] px-3 py-1.5 text-base font-medium text-[var(--gray-50)] hover:bg-[var(--gray-10)]"
                      >
                        메시지 확인하기
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      {/* 메시지 모달: coffectId로 서버 최신 데이터를 조회, 삭제는 cardId 기준 */}
      {checkedMessage && !isMessageHidden && (
        <MessageModal
          coffectId={checkedMessage.coffectId ?? null}
          message={{
            id: checkedMessage.cardId, // 삭제/동기화를 위한 카드 식별자 유지
            name: checkedMessage.name,
            time: new Date().toLocaleString(),
            intro: checkedMessage.message ?? "커피챗 제안 메시지가 도착했어요!",
          }}
          onClose={handleClose}
          onDelete={handleDeleteRequest}
          onChat={handleChat}
        />
      )}

      {/* 삭제 확인 모달 */}
      {pendingDeleteId != null && checkedMessage && (
        <DeleteSuggestModal
          messageName={checkedMessage.name}
          onDelete={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

      {acceptNotice?.open && (
        <CoffeeSuggestResponseModal
          userName={acceptNotice.userName}
          onClose={() => setAcceptNotice(null)}
          onChat={() => {
            if (acceptNotice?.chatId) navigate(`/chat/${acceptNotice.chatId}`);
            else navigate("/chat");
            setAcceptNotice(null);
          }}
        />
      )}
    </div>
  );
};

export default CoffeeSuggestBanner;
