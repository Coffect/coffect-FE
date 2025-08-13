/*
  author      : 이희선
  description : 커피챗 제안 배너 (FCM만으로 수신/표시)
*/

import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useRef, useState } from "react";
import "swiper/css";
import { Swiper as SwiperClass } from "swiper";
import MessageModal from "./MessageModal";
import DeleteSuggestModal from "./DeleteSuggestModal";
import { useNavigate } from "react-router-dom";
import NoSuggestImage from "../../assets/icon/home/NoSuggest.png";

// FCM 포그라운드 수신용
import { onMessageListener, type FcmPayload } from "@/utils/fcm";

/** 배너 카드 타입 */
interface Suggestion {
  id: string;
  name: string;
  message: string;
  image: string;
  userPageId?: string | number;
}

/** SW→페이지 postMessage에서 쓰는 타입(단건/배열 모두 지원) */
type SwPostMessage =
  | { source?: string; payload?: FcmPayload; payloads?: FcmPayload[] }
  | FcmPayload;

/** FCM payload → 배너 카드로 변환(우리 타입만 통과) */
function toSuggestion(payload: FcmPayload): Suggestion | null {
  const data = payload.data ?? {};
  if (data.type !== "coffee_chat_proposal") return null;

  const id = String(data.coffectId ?? Date.now());
  const name = (data.firstUserName as string) ?? "알 수 없음";
  const message =
    (payload.notification?.body as string) ?? "커피챗 제안이 도착했어요!";
  const image = (payload.notification?.image as string) ?? "/favicon.ico"; // 서버에서 image 오면 사용

  return {
    id,
    name,
    message,
    image,
    userPageId: data.firstUserId,
  };
}

/** 타입 가드 */
const isFcmPayload = (x: unknown): x is FcmPayload =>
  !!x &&
  typeof x === "object" &&
  ("data" in (x as Record<string, unknown>) ||
    "notification" in (x as Record<string, unknown>));

const CoffeeSuggestBanner = () => {
  const swiperRef = useRef<SwiperClass | null>(null);
  const navigate = useNavigate();

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  /** 공통 push (중복 방지) */
  const pushSuggestion = (p: FcmPayload) => {
    const s = toSuggestion(p);
    if (!s) return;
    setSuggestions((prev) =>
      prev.some((v) => v.id === s.id) ? prev : [s, ...prev],
    );
  };

  // 1) 포그라운드(onMessage) 수신
  useEffect(() => {
    const unsub = onMessageListener((payload) => pushSuggestion(payload));
    return () => unsub?.();
  }, []);

  // 2) SW(백그라운드)에서 쏘는 postMessage 수신 + 누적분 flush 요청
  useEffect(() => {
    const onSwMessage = (ev: MessageEvent<SwPostMessage>) => {
      // 단건
      if (isFcmPayload(ev.data)) {
        pushSuggestion(ev.data);
        return;
      }
      // { payload } / { payloads }
      if (ev.data && typeof ev.data === "object") {
        const single = (ev.data as { payload?: FcmPayload }).payload;
        const many = (ev.data as { payloads?: FcmPayload[] }).payloads;
        if (single) pushSuggestion(single);
        if (Array.isArray(many)) many.forEach(pushSuggestion);
      }
    };

    // 채널 두 군데 모두 바인딩(브라우저/타이밍 이슈 회피)
    navigator.serviceWorker.addEventListener("message", onSwMessage);
    window.addEventListener("message", onSwMessage);

    // 마운트 직후, SW에 누적 payloads 요청(레이스 방지)
    (async () => {
      const reg = await navigator.serviceWorker.getRegistration();
      reg?.active?.postMessage({ type: "fcm-flush" });
    })();

    return () => {
      navigator.serviceWorker.removeEventListener("message", onSwMessage);
      window.removeEventListener("message", onSwMessage);
    };
  }, []);

  // SW가 페이지를 컨트롤하지 않는 타이밍 보강
  useEffect(() => {
    const flush = async () => {
      const reg = await navigator.serviceWorker.getRegistration();
      reg?.active?.postMessage({ type: "fcm-flush" });
    };

    if (navigator.serviceWorker.controller) {
      // 이미 컨트롤 중이면 바로 요청
      flush();
    } else {
      // 아직이면 컨트롤되자마자 1회 요청
      const onCtrl = () => {
        flush();
        navigator.serviceWorker.removeEventListener("controllerchange", onCtrl);
      };
      navigator.serviceWorker.addEventListener("controllerchange", onCtrl);
    }
  }, []);

  // ===== 모달 상태 =====
  const [checkedMessage, setCheckedMessage] = useState<Suggestion | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isMessageHidden, setIsMessageHidden] = useState(false);

  const handleClose = () => {
    setCheckedMessage(null);
    setPendingDeleteId(null);
    setIsMessageHidden(false);
  };
  const handleDeleteRequest = (id: string) => {
    setIsMessageHidden(true);
    setPendingDeleteId(id);
  };
  const handleCancelDelete = () => {
    setIsMessageHidden(false);
    setPendingDeleteId(null);
  };
  const handleConfirmDelete = () => {
    if (pendingDeleteId != null) {
      setSuggestions((prev) => prev.filter((s) => s.id !== pendingDeleteId));
      setCheckedMessage(null);
      setPendingDeleteId(null);
      setIsMessageHidden(false);
    }
  };
  const handleChat = () => {
    navigate("/chat");
    handleClose();
  };

  const hasSuggestions = suggestions.length > 0;

  return (
    <div className="mt-[2%] flex w-full items-center justify-center overflow-hidden">
      <div className="flex h-auto w-full">
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
          <Swiper
            className="h-auto w-full"
            spaceBetween={16}
            slidesPerView={1}
            onSwiper={(sw) => (swiperRef.current = sw)}
          >
            {suggestions.map((user) => (
              <SwiperSlide
                key={user.id}
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
                      <button
                        onClick={() =>
                          navigate(
                            user.userPageId
                              ? `/userpage/${user.userPageId}`
                              : `/userpage/${user.id}`,
                          )
                        }
                        className="rounded-[12px] bg-[var(--gray-80)] px-4 py-1.5 text-base font-medium text-[var(--gray-0)]"
                      >
                        프로필 보기
                      </button>
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

      {checkedMessage && !isMessageHidden && (
        <MessageModal
          message={{
            id: checkedMessage.id,
            name: checkedMessage.name,
            time: new Date().toLocaleString(),
            intro: checkedMessage.message ?? "커피챗 제안 메시지가 도착했어요!",
          }}
          onClose={handleClose}
          onDelete={() => handleDeleteRequest(checkedMessage.id)}
          onChat={handleChat}
        />
      )}

      {pendingDeleteId != null && checkedMessage && (
        <DeleteSuggestModal
          messageName={checkedMessage.name}
          onDelete={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default CoffeeSuggestBanner;
