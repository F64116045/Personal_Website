import React, { useState } from "react";
import { useEffect, useRef } from 'react';
import io from "socket.io-client"; // 引入 socket.io-client
import './Chatroom.css';

const socket = io("http://localhost:3000"); // 連接到伺服器

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
    const message = { text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, message]);
    socket.emit("chatMessage", message.text);  // 發送訊息到伺服器
    setInput(""); // 清空輸入框
  };
  

  const messagesEndRef = useRef(null); // 創建一個引用來追蹤訊息區底部

  useEffect(() => {
    socket.on("chatMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, { text: message, sender: "server" }]);
    });
  
    // 清理當組件卸載時的事件監聽器
    return () => {
      socket.off("chatMessage");
    };
  }, []);

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
