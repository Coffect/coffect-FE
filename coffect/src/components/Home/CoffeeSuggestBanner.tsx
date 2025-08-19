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
import { flushSync } from "react-dom";

// FCM payload 타입
import type { FcmPayload } from "@/utils/fcm";
// 프로필 라우팅용: 숫자 기반 유저 ID → 문자열 ID 변환 API
import { acceptCoffeeChat, getUserStringId } from "@/api/home";
import { createChatRoom } from "@/api/chat";
import CoffeeSuggestResponseModal from "./CoffeeSuggestResponseModal";

/* --------------------------------- 타입 --------------------------------- */

/** 배너에 표시되는 제안 카드 데이터 구조 */
interface Suggestion {
  cardId: string; // UI에서 카드 삭제용 ID
  coffectId?: number | null; // 서버 조회용 ID
  name: string;
  message: string;
  image: string;
  userId?: string;
  userPageId?: string | number;
}

/** 서비스워커에서 postMessage로 전달되는 데이터 타입 */
type SwPostMessage =
  | { source?: string; payload?: FcmPayload; payloads?: FcmPayload[] }
  | FcmPayload;

/** 채팅방 생성 API 응답 최소 형태 */
type CreateRoomSuccess = { success?: { chatRoomId?: string | number } };
type CreateRoomConflict = {
  error?: { errorCode?: "EC409"; data?: string | number };
};
type CreateRoomResponse = CreateRoomSuccess | CreateRoomConflict;

/** 커피챗 수락 알림 모달 상태 */
type AcceptNotice = {
  open: boolean;
  userName: string;
  chatId?: number;
};

/* ------------------------------- 타입 가드 ------------------------------- */

/** 객체가 FCM payload인지 판별 */
const isFcmPayload = (x: unknown): x is FcmPayload =>
  !!x &&
  typeof x === "object" &&
  ("data" in (x as Record<string, unknown>) ||
    "notification" in (x as Record<string, unknown>));

/** FCM type이 수락 관련 타입인지 판별 */
const isAcceptType = (
  t: unknown,
): t is "accept_coffee_chat" | "ACCEPT_RESULT" | "accept_result" =>
  t === "accept_coffee_chat" || t === "ACCEPT_RESULT" || t === "accept_result";

/** 수락 FCM payload → AcceptNotice 변환 */
const acceptNoticeFrom = (p?: FcmPayload): AcceptNotice | null => {
  const t = p?.data?.type;
  if (!isAcceptType(t)) return null;

  const nameFromSecond = p?.data?.secondUserName as string | undefined;
  const nameFromFirst = p?.data?.firstUserName as string | undefined;
  const userName = nameFromSecond ?? nameFromFirst ?? "상대방";

  const raw = p?.data?.chatId as string | number | undefined;
  const chatId =
    raw != null && !Number.isNaN(Number(raw)) ? Number(raw) : undefined;

  return { open: true, userName, chatId };
};

/* --------------------------- 변환 유틸리티 함수 --------------------------- */

/** FCM payload → Suggestion 변환 */
const toSuggestion = (payload: FcmPayload): Suggestion | null => {
  const data = payload.data ?? {};
  if (data.type !== "coffee_chat_proposal") return null;

  // 다양한 필드명 케이스 수용
  const coffectIdRaw =
    (data.coffectId as string | number | undefined) ??
    (data.coffeeChatId as string | number | undefined) ??
    (data.coffeeid as string | number | undefined);

  const coffectIdNum =
    coffectIdRaw != null && !Number.isNaN(Number(coffectIdRaw))
      ? Number(coffectIdRaw)
      : null;

  const cardId = String(coffectIdRaw ?? Date.now());

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

/* ----------------------------- 응답 타입 가드 ----------------------------- */

const hasSuccess = (res: CreateRoomResponse): res is CreateRoomSuccess =>
  "success" in res && typeof res.success === "object" && res.success !== null;

const hasConflict409 = (res: CreateRoomResponse): res is CreateRoomConflict =>
  "error" in res &&
  typeof res.error === "object" &&
  res.error !== null &&
  res.error.errorCode === "EC409";

/* -------------------------------- 컴포넌트 ------------------------------- */

const CoffeeSuggestBanner: React.FC = () => {
  /* ------------------------------ 훅/상태 ------------------------------ */
  const swiperRef = useRef<SwiperClass | null>(null);
  const navigate = useNavigate();

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [checkedMessage, setCheckedMessage] = useState<Suggestion | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isMessageHidden, setIsMessageHidden] = useState(false);
  const [acceptNotice, setAcceptNotice] = useState<AcceptNotice | null>(null);

  /* ------------------------------- 핸들러 ------------------------------- */

  /** 새로운 FCM 제안 추가 */
  const pushSuggestion = (p: FcmPayload) => {
    const s = toSuggestion(p);
    if (!s) return;
    setSuggestions((prev) =>
      prev.some((v) => v.cardId === s.cardId) ? prev : [s, ...prev],
    );
  };

  /** 모달 닫기 */
  const handleClose = () => {
    setCheckedMessage(null);
    setPendingDeleteId(null);
    setIsMessageHidden(false);
  };

  /** 삭제 요청 → 대기 상태 전환 */
  const handleDeleteRequest = (id: string) => {
    setIsMessageHidden(true);
    setPendingDeleteId(id);
  };

  /** 삭제 확정 처리 */
  const handleConfirmDelete = () => {
    if (pendingDeleteId == null) return;

    // UI에서 제거
    setSuggestions((prev) => prev.filter((s) => s.cardId !== pendingDeleteId));

    // SW에도 삭제 알림
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
  };

  /** 삭제 취소 */
  const handleCancelDelete = () => {
    setIsMessageHidden(false);
    setPendingDeleteId(null);
  };

  /** 채팅방 생성 응답에서 ID 추출 */
  const pickIdFromResponse = (res: CreateRoomResponse) => {
    if (hasSuccess(res)) {
      const okId = res.success?.chatRoomId;
      if (typeof okId === "string" || typeof okId === "number") return okId;
    }
    if (hasConflict409(res)) {
      const d = res.error?.data;
      if (typeof d === "string" || typeof d === "number") return d;
    }
    return undefined;
  };

  /** AxiosError 유사 객체에서 409 충돌 ID 추출 */
  interface Axios409Like {
    response?: { status?: number; data?: CreateRoomConflict };
  }
  const pickIdFromAxiosError = (err: unknown) => {
    const e = err as Axios409Like;
    if (e.response?.status === 409) {
      const d = e.response.data?.error?.data;
      if (typeof d === "string" || typeof d === "number") return d;
    }
    return undefined;
  };

  /** 채팅 시작: 채팅방 생성 → 이동 */
  const handleChat = async () => {
    if (!checkedMessage) return;

    try {
      // 1) 커피챗 수락 API
      if (typeof checkedMessage.coffectId === "number") {
        try {
          await acceptCoffeeChat(checkedMessage.coffectId);
        } catch (e) {
          console.warn("acceptCoffeeChat 실패", e);
        }
      } else {
        console.warn("coffectId 없음");
      }

      // 2) 채팅방 생성
      const res = (await createChatRoom(
        checkedMessage.userPageId as number,
      )) as CreateRoomResponse;

      const id = pickIdFromResponse(res);
      if (id !== undefined) {
        navigate(`/chat/${id}`);
      } else {
        console.error("채팅방 ID를 가져올 수 없습니다.", res);
        navigate("/chat");
      }
    } catch (err) {
      // 3) 이미 존재(409) → 해당 채팅방으로 이동
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

  /* --------------------------- SW 메시지 처리 --------------------------- */
  useEffect(() => {
    const onSwMessage = (ev: MessageEvent<SwPostMessage>) => {
      // 단건 payload
      if (isFcmPayload(ev.data)) {
        const notice = acceptNoticeFrom(ev.data);
        if (notice) {
          // flushSync로 즉시 반영
          flushSync(() => setAcceptNotice(notice));
          return;
        }
        pushSuggestion(ev.data);
        return;
      }

      // 객체 포맷(payload/payloads)
      if (ev.data && typeof ev.data === "object") {
        const single = (ev.data as { payload?: FcmPayload }).payload;
        const many = (ev.data as { payloads?: FcmPayload[] }).payloads;

        if (single) {
          const notice = acceptNoticeFrom(single);
          if (notice) {
            flushSync(() => setAcceptNotice(notice));
            return;
          }
          pushSuggestion(single);
        }
        if (Array.isArray(many)) {
          let opened = false;
          for (const p of many) {
            if (opened) {
              pushSuggestion(p);
              continue;
            }
            const n = acceptNoticeFrom(p);
            if (n) {
              flushSync(() => setAcceptNotice(n));
              opened = true;
            } else {
              pushSuggestion(p);
            }
          }
        }
      }
    };

    const hasSW =
      typeof navigator !== "undefined" && "serviceWorker" in navigator;

    if (hasSW && navigator.serviceWorker) {
      navigator.serviceWorker.addEventListener("message", onSwMessage);
    }
    window.addEventListener("message", onSwMessage);

    // 초기 flush 요청
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

  /* --------------------------- 전역 브릿지 처리 -------------------------- */
  useEffect(() => {
    const onFg = (e: Event) => {
      const payload = (e as CustomEvent).detail as FcmPayload;

      const notice = acceptNoticeFrom(payload);
      if (notice) {
        flushSync(() => setAcceptNotice(notice));
        return;
      }
      pushSuggestion(payload);
    };
    window.addEventListener("coffect:fcm", onFg as EventListener);
    return () =>
      window.removeEventListener("coffect:fcm", onFg as EventListener);
  }, []);

  /* -------------------------- SW 제어권 획득 보강 ------------------------- */
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
      flush();
    } else if (hasSW) {
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
        {/* 제안 없을 때 표시 */}
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
          /* 제안 있을 때 Swiper */
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
                  <img
                    src={user.image}
                    alt="프로필 사진"
                    className="aspect-[1/1] w-[18%] rounded-full object-cover"
                  />

                  <div className="flex w-0 flex-1 flex-col justify-center">
                    <p className="mb-[3%] ml-[3%] overflow-hidden text-base font-medium text-[var(--gray-70)]">
                      <span className="text-base font-bold text-[var(--gray-85)]">
                        {user.name}
                      </span>
                      님의 {user.message}
                    </p>

                    <div className="ml-[3%] flex justify-start">
                      {/* 프로필 보기 버튼 */}
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

                      {/* 메시지 확인 버튼 */}
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

      {/* 메시지 모달 */}
      {checkedMessage && !isMessageHidden && (
        <MessageModal
          coffectId={checkedMessage.coffectId ?? null}
          message={{
            id: checkedMessage.cardId,
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

      {/* 수락 알림 모달 */}
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
