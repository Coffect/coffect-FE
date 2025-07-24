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
    plugin(function ({ addBase }) {
      addBase({
        "html, body, div, span, applet, object, iframe,\
        h1, h2, h3, h4, h5, h6, p, blockquote, pre,\
        a, abbr, acronym, address, big, cite, code,\
        del, dfn, em, img, ins, kbd, q, s, samp,\
        small, strike, strong, sub, sup, tt, var,\
        b, u, i, center,\
        dl, dt, dd, ol, ul, li,\
        fieldset, form, label, legend,\
        table, caption, tbody, tfoot, thead, tr, th, td,\
        main, article, aside, canvas, details, embed,\
        figure, figcaption, footer, header, hgroup,\
        menu, nav, output, ruby, section, summary,\
        time, mark, audio, video, input, button": {
          margin: "0",
          padding: "0",
          border: "0",
          fontSize: "100%",
          font: "inherit",
          verticalAlign: "baseline",
        },
        "article, aside, details, figcaption, figure,\
        footer, header, hgroup, menu, nav, section, div": {
          display: "block",
        },
        body: {
          lineHeight: "1",
        },
        "ol, ul": {
          listStyle: "none",
        },
        "blockquote, q": {
          quotes: "none",
        },
        "blockquote:before, blockquote:after,\
        q:before, q:after": {
          content: "''",
        },
        table: {
          borderCollapse: "collapse",
          borderSpacing: "0",
        },
      });
    }),
  ],
};

export default config;
