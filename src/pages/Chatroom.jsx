import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import './Chatroom.css';
import { jwtDecode } from 'jwt-decode';

const socket = io("http://localhost:5000"); // ✅ 連線到 WebSocket

const Chatroom = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || ""); // 儲存登入 Token
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (token) {
      fetchMessages();
    }
  }, [token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("WebSocket connected:", socket.id); // 確認連線
    });
  
    socket.on("receive_message", (message) => {
      console.log("📥 收到訊息:", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  
    return () => socket.off("receive_message"); // 清除監聽，避免重複綁定
  }, []);
  




  const fetchMessages = async () => {
    try {
      // 發送 GET 請求到伺服器端的消息 API，並攜帶 Authorization token
      const res = await fetch("http://localhost:5000/messages", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch messages");

      
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async () => {
    if (input.trim() === "") return;
  
    const decodedToken = jwtDecode(token);  // 使用 jwtDecode 函數
    const userId = decodedToken.userId;
  
    const messageData = { text: input, userId };  // 包含 userId
    socket.emit("send_message", messageData); // 透過 WebSocket 發送訊息
    setInput(""); // 清空輸入框
  };
  
  

  const handleAuth = async (endpoint, userData) => {
    try {
      const res = await fetch(`http://localhost:5000/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData), // 將 userData 轉換為 JSON 字串作為請求的內容
      });

      if (!res.ok) throw new Error(`${endpoint} failed`);
      
      // 解析回應的 JSON 資料
      const data = await res.json();
      if (endpoint === "login") {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        setShowLoginModal(false);
        fetchMessages(); // 取得訊息
      } else {
        setShowRegisterModal(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    setMessages([]);
  };

  return (
    <div className="container">
      {!token ? (
        <div className="login-container">
          <button onClick={() => setShowLoginModal(true)}>登入</button>
          <button onClick={() => setShowRegisterModal(true)}>註冊</button>
        </div>
      ) : (
        <button onClick={handleLogout} className="logout-button">登出</button>
      )}

      <div className="chatroom">
        {showRegisterModal && (
          <AuthModal
            title="註冊"
            onSubmit={(userData) => handleAuth("register", userData)}
            onClose={() => setShowRegisterModal(false)}
          />
        )}

        {showLoginModal && (
          <AuthModal
            title="登入"
            onSubmit={(userData) => handleAuth("login", userData)}
            onClose={() => setShowLoginModal(false)}
          />
        )}

        <div className="messages-container">
          {messages.map((msg, index) => (
            <div key={index} className="message">
              <span>{msg.sender}: {msg.text}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {token && (
          <div className="input-container">
            <textarea
              className="inputbox"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="輸入訊息..."
            />
            <button className="send-button" onClick={handleSendMessage}>送出</button>
          </div>
        )}
      </div>
    </div>
  );
};

const AuthModal = ({ title, onSubmit, onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{title}</h2>
        <input
          type="text"
          placeholder="輸入用戶名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="輸入密碼"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={() => onSubmit({ username, password })}>{title}</button>
        <button onClick={onClose}>關閉</button>
      </div>
    </div>
  );
};

export default Chatroom;
