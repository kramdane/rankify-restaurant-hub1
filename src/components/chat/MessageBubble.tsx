import { type Message } from "./types";

export const MessageBubble = ({ message }: { message: Message }) => {
  return (
    <div
      className={`mb-4 ${
        message.role === "assistant"
          ? "bg-primary/10 p-3 rounded-lg"
          : "bg-primary p-3 rounded-lg"
      }`}
    >
      <p
        className={`text-sm whitespace-pre-line ${
          message.role === "assistant" ? "text-foreground" : "text-white"
        }`}
      >
        {message.content}
      </p>
    </div>
  );
};