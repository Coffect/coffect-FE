//css 파일도 모듈임을 typescript에게 알림(에러 제거)
declare module "swiper/css";

declare module "workbox-precaching" {
  export function precacheAndRoute(
    manifest: readonly string[],
    options?: {
      directoryIndex?: string;
      cleanURLs?: boolean;
      ignoreURLParametersMatching?: RegExp[];
      urlManipulation?: (match: URL) => string[];
    },
  ): void;
}
