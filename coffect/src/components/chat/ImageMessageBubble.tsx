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
}

const ImageMessageBubble: React.FC<ImageMessageBubbleProps> = ({
  mine,
  imageUrl,
  showProfile,
  profileImage,
}) => (
  <div
    className={
      mine
        ? "flex items-end justify-end gap-2"
        : "flex flex-row items-start gap-2"
    }
  >
    {/* 상대방이 이미지를 보냈을 때 프로필과 같이 띄어지기 */}
    {!mine && showProfile && (
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
    )}
    <img
      src={imageUrl}
      alt="전송된 이미지"
      className="max-h-[160px] max-w-[160px] rounded-lg border border-[var(--gray-10)] object-cover"
    />
  </div>
);

export default ImageMessageBubble;
