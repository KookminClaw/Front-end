import { useState } from "react";
import { FaRobot, FaUser } from "react-icons/fa";
import { IoChatbubblesSharp } from "react-icons/io5";

export default function ChatbotOverlay({ open, onToggle }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "안녕하세요. 국민클로 공지 AI 도우미입니다. 궁금한 공지나 일정을 물어보세요.",
    },
  ]);

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages((current) => [
      ...current,
      { role: "user", text: input },
      { role: "bot", text: "확인했어요. 관련 공지를 찾아볼게요." },
    ]);
    setInput("");
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-[100px] right-8 w-[360px] h-[500px] bg-white rounded-[20px] shadow-[0_8px_40px_rgba(0,0,0,0.15)] z-[300] flex flex-col overflow-hidden">
          <div className="bg-primary px-5 py-4 flex items-center gap-2.5 text-white">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-lg">
              <FaRobot />
            </div>
            <div>
              <div className="text-sm font-bold">국민클로 AI 도우미</div>
              <div className="text-[11px] opacity-80">공지 관련 질문을 입력하세요</div>
            </div>
            <button
              type="button"
              className="ml-auto text-lg cursor-pointer opacity-80"
              onClick={onToggle}
            >
              x
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex gap-2 max-w-[85%] ${
                  message.role === "user" ? "self-end flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0 ${
                    message.role === "user" ? "bg-gray-200" : "bg-primary-light"
                  }`}
                >
                  {message.role === "user" ? <FaUser /> : <FaRobot />}
                </div>
                <div
                  className={`px-3 py-2.5 text-xs leading-relaxed ${
                    message.role === "user"
                      ? "bg-primary text-white rounded-tl-[14px] rounded-tr-[14px] rounded-br rounded-bl-[14px]"
                      : "bg-surface text-heading rounded-tl-[14px] rounded-tr-[14px] rounded-br-[14px] rounded-bl"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          <div className="px-4 py-3 border-t border-line flex gap-2 items-end">
            <textarea
              className="flex-1 border border-line rounded-[10px] px-3 py-[9px] text-xs resize-none outline-none bg-surface text-heading"
              placeholder="메시지를 입력하세요"
              rows="1"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  sendMessage();
                }
              }}
            />
            <button
              type="button"
              className="w-9 h-9 bg-primary border-none rounded-[9px] text-white text-base cursor-pointer flex items-center justify-center shrink-0"
              onClick={sendMessage}
            >
              보내기
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        className="fixed bottom-8 right-8 w-14 h-14 bg-primary rounded-full flex items-center justify-center text-2xl cursor-pointer shadow-[0_4px_20px_rgba(79,110,247,0.4)] z-[300] transition-transform duration-200 text-white hover:scale-[1.08]"
        onClick={onToggle}
      >
        <IoChatbubblesSharp />
      </button>
    </>
  );
}
