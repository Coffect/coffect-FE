// chat.ts: 메시지 타입
export type Message =
  | { id: number; type: "text"; text: string; time: string; mine: boolean }
  | {
      id: number;
      type: "image";
      imageUrl: string;
      mine: boolean;
      time: string;
    };
