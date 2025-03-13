import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import './Chatroom.css';
import { jwtDecode } from 'jwt-decode';

const socket = io("http://localhost:5000"); // ✅ 連線到 WebSocket

const Chatroom = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || ""); 
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // ❌ 儲存錯誤訊息
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const messagesEndRef = useRef(null);

  const adminId = "admin"; // 假設管理員 ID

  useEffect(() => {
    if (!token) return;

    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken.userId) {
        fetchMessages();
        joinChatRoom();
      }
    } catch (error) {
      console.error("JWT 解碼錯誤:", error);
      setToken("");
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("WebSocket connected:", socket.id);
    });

    socket.on("receive_private_message", (message) => {
      console.log("📥 收到訊息:", message);
      setMessages((prevMessages) => [...prevMessages, message]); // ✅ 即時顯示訊息
    });

    return () => socket.off("receive_private_message");
  }, []);

  const joinChatRoom = () => {
    if (!token) return;

    try {
      const decodedToken = jwtDecode(token);
      if (!decodedToken.userId) return;
      socket.emit("join_room", decodedToken.userId);
    } catch (error) {
      console.error("JWT 解碼錯誤:", error);
      setToken("");
      localStorage.removeItem("token");
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch(`http://localhost:5000/messages/${adminId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch messages");

      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAuth = async (endpoint, userData) => {
    try {
      const res = await fetch(`http://localhost:5000/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (!res.ok || !data.token) {
        throw new Error(data.message || (endpoint === "login" ? "登入失敗" : "註冊失敗"));
      }

      setToken(data.token);
      localStorage.setItem("token", data.token);
      setShowLoginModal(false);
      setShowRegisterModal(false);
      fetchMessages();
      joinChatRoom();
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message);
    }
  };

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      const receiverId = decodedToken.role === "admin" ? selectedVisitor : adminId;

      const messageData = { sender: userId, receiver: receiverId, text: input, timestamp: new Date() };

      setMessages((prevMessages) => [...prevMessages, messageData]); // ✅ 立即顯示訊息
      socket.emit("send_private_message", messageData);
      setInput("");
    } catch (error) {
      console.error("無法發送訊息:", error);
      setErrorMessage("發送訊息時發生錯誤");
    }
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    setMessages([]);
  };

  return (
    <div className="container-chatroom">
      {!token ? (
        <div className="login-container">
          <button className="login-button" onClick={() => setShowLoginModal(true) }>登入</button>
          <button className="login-button" onClick={() => setShowRegisterModal(true)}>註冊</button>
        </div>
      ) : (
        <button onClick={handleLogout} className="logout-button">登出</button>
      )}

      {errorMessage && <ErrorModal message={errorMessage} onClose={() => setErrorMessage("")} />}

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
            <div key={index} className={`message ${msg.sender === adminId ? "admin" : "visitor"}`}>
              <span>{msg.sender === adminId ? "管理員" : "訪客"}: {msg.text}</span>
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

const ErrorModal = ({ message, onClose }) => {
  return (
    <div className="modal-error">
      <div className="modal-content">
        <p>{message}</p>
        <button onClick={onClose}>關閉</button>
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
        <input type="text" placeholder="輸入用戶名" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="輸入密碼" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={() => onSubmit({ username, password })}>{title}</button>
        <button onClick={onClose}>關閉</button>
      </div>
    </div>
  );
};

export default Chatroom;
