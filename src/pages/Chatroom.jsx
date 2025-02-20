import React, { useState } from "react";

const Chatroom = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // 處理輸入變更
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  // 發送訊息
  const handleSendMessage = () => {
    if (input.trim() === "") return;
    setMessages([...messages, { text: input, sender: "user" }]);
    setInput(""); // 清空輸入框
  };

  return (
    <div >
      <div >
        {messages.map((msg, index) => (
          <div key={index} className={`p-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>

      {/* 輸入框 */}
      <div className="flex p-2">
        <input
          type="text"
          className="flex-1 border rounded p-2"
          value={input}
          onChange={handleInputChange}
          placeholder="輸入訊息..."
        />
        <button onClick={handleSendMessage}>
          送出
        </button>
      </div>
    </div>
  );
};

export default Chatroom;
