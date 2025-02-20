import React, { useState } from "react";
import { useEffect, useRef } from 'react';
import './Chatroom.css';

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

  const messagesEndRef = useRef(null); // 創建一個引用來追蹤訊息區底部

  useEffect(() => {
    // 每當訊息變動，滾動到底部
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]); // 當 messages 改變時觸發

  return (
    <div className="container">
      <div className="chatroom">
        {/* 訊息列表 */}
        <div className="messages-container">
          {messages.map((msg, index) => (
            <div key={index} className={`p-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
              <span
                dangerouslySetInnerHTML={{
                  __html: msg.text.replace(/\n/g, "<br/>") /* 替換換行符號為 <br> */
                }}
              ></span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div >

  
        {/* 輸入框 */}
        <div className="input-container">
          <textarea
            type="text"
            className="inputbox"
            value={input}
            onChange={handleInputChange}
            placeholder="輸入訊息..."
          />
          <button className="send-button" onClick={handleSendMessage}>
            送出
          </button>
        </div>
      </div>
    </div>
  );
  
};

export default Chatroom;
