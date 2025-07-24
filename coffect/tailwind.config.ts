/*
 Tailwind CSS 설정 파일
 - 프로젝트 전역 폰트, 컬러, 리셋(base) 등 글로벌 스타일 관리
 - Tailwind 기본값을 최대한 활용, 필요한 부분만 커스텀/확장
*/

import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "Roboto",
          '"Helvetica Neue"',
          '"Segoe UI"',
          '"Apple SD Gothic Neo"',
          '"Noto Sans KR"',
          '"Malgun Gothic"',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          "sans-serif",
        ],
      },
    },
  },
  plugins: [
    plugin(function ({ addBase, theme }) {
      addBase({
        body: {
          fontFamily: theme("fontFamily.sans").join(", "),
        },
      });
    }),
  ],
};

export default config;
