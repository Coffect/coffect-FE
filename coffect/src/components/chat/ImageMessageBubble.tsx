/*
 * author : 앨리스/박은지
 * description : 이미지 메시지 버블
 */

import React from "react";

interface ImageMessageBubbleProps {
  mine: boolean;
  imageUrl: string;
  showProfile: boolean;
  profileImage?: string;
  time?: string;
  showTime?: boolean;
}

const timeText = "mb-1 text-[11px] text-[var(--gray-40)] whitespace-nowrap";

const ImageMessageBubble: React.FC<ImageMessageBubbleProps> = ({
  mine,
  imageUrl,
  showProfile,
  profileImage,
  time,
  showTime = true,
}) => {
  if (mine) {
    return (
      <div className="flex max-w-[80%] items-end justify-end gap-2">
        <span className={`${timeText} ${!showTime ? "invisible" : ""}`}>
          {showTime ? time : "\u00A0"}
        </span>
        <div className="h-[160px] w-[160px] flex-shrink-0 overflow-hidden rounded-lg border border-[var(--gray-10)]">
          <img
            src={imageUrl}
            alt="전송된 이미지"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex max-w-[80%] flex-row items-start gap-2">
      {showProfile ? (
        <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-[var(--gray-20)]">
          {profileImage ? (
            <img
              src={profileImage}
              alt="프로필"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full rounded-full border border-[var(--gray-10)] bg-[var(--gray-30)]" />
          )}
        </div>
      ) : (
        <div className="h-8 w-8 flex-shrink-0" />
      )}
      <div className="flex min-w-0 flex-row items-end gap-2">
        <div className="h-[160px] w-[160px] flex-shrink-0 overflow-hidden rounded-lg border border-[var(--gray-10)]">
          <img
            src={imageUrl}
            alt="전송된 이미지"
            className="h-full w-full object-cover"
          />
        </div>
        <span
          className={`flex-shrink-0 self-end ${timeText} ${!showTime ? "invisible" : ""}`}
        >
          {showTime ? time : "\u00A0"}
        </span>
      </div>
    </div>
  );
};

export default ImageMessageBubble;
