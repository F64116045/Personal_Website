import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import './Chatroom.css';
import { jwtDecode } from 'jwt-decode';

const socket = io("http://localhost:5000");

const Chatroom = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
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
      console.log("WebSocket connected:", socket.id);
    });

    socket.on("receive_message", (message) => {
      console.log("📥 收到訊息:", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("update_online_users", (users) => {
      setOnlineUsers(users.filter(user => user !== "admin"));
    });

    return () => {
      socket.off("receive_message");
      socket.off("update_online_users");
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);
  


  const fetchMessages = async () => {
    try {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) throw new Error("未找到 Token，請重新登入");

        console.log("🚀 嘗試獲取歷史訊息...");
        console.log("🛠️ Token:", storedToken);

        const res = await fetch("http://localhost:5000/messages", {
            headers: { Authorization: `Bearer ${storedToken}` },
        });

        console.log("🔄 伺服器回應狀態碼:", res.status);

        if (!res.ok) {
            const errorData = await res.json();
            console.error("❌ 伺服器錯誤:", errorData);
            throw new Error(errorData.message || "無法獲取訊息");
        }

        const data = await res.json();
        console.log("✅ 歷史訊息獲取成功:", data);

        // ✅ 確保 sender 是字串
        const formattedMessages = data.map(msg => ({
            ...msg,
            sender: msg.sender.username || msg.sender, // 確保 sender 為字串
        }));

        setMessages(formattedMessages);
    } catch (err) {
        console.error("❌ 錯誤:", err);
        setErrorMessage(err.message || "無法獲取訊息，請稍後再試。");
    }
  };



  const handleSendMessage = async () => {
    if (input.trim() === "" || !token) return;

    try {
        const decodedToken = jwtDecode(token);
        if (!decodedToken?.userId || !decodedToken?.username) throw new Error("無效的 Token");

        const userId = decodedToken.userId;
        const username = decodedToken.username;  // ✅ 取得 username
        

        const messageData = {
            sender: userId,
            text: input,
            timestamp: new Date(),
        };

        const res = await fetch("http://localhost:5000/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(messageData),
        });

        if (!res.ok) throw new Error("訊息儲存失敗");

        const savedMessage = await res.json();

        // ✅ 這裡確保 sender 直接顯示 username
        setMessages((prevMessages) => [
            ...prevMessages,
            { ...savedMessage, sender: username }  // ⚡️ 改成 `username`，不顯示 `userId`
        ]);

        socket.emit("send_private_message", { ...savedMessage, sender: username }); // ✅ 廣播正確的 username
        setInput("");
    } catch (error) {
        console.error("無法發送訊息:", error);
        setErrorMessage("發送訊息時發生錯誤");
    }
};




  const handleAuth = async (endpoint, userData) => {
    try {
        console.log("🚀 嘗試登入/註冊:", endpoint);
        console.log("🛠️ 發送的資料:", userData);

        const res = await fetch(`http://localhost:5000/${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });

        console.log("🔄 伺服器回應狀態碼:", res.status);
        const data = await res.json();

        if (!res.ok) {
            console.error("❌ 錯誤回應:", data);
            throw new Error(data.message || `${endpoint} 失敗`);
        }

        if (endpoint === "login") {
            console.log("✅ 登入成功，Token:", data.token);
            localStorage.setItem("token", data.token);
            setToken(data.token);
            setShowLoginModal(false);
            fetchMessages();
        } else {
            setShowRegisterModal(false);
        }
    } catch (err) {
        console.error("❌ 發生錯誤:", err);
        setErrorMessage(err.message || "請檢查輸入內容");
    }
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    setMessages([]);
  };

  return (
    <div className="container">
      {errorMessage && <ErrorModal message={errorMessage} onClose={() => setErrorMessage("")} />}

      {!token ? (
        <div className="login-container">
          <button onClick={() => setShowLoginModal(true)}>登入</button>
          <button onClick={() => setShowRegisterModal(true)}>註冊</button>
        </div>
      ) : (
        <button onClick={handleLogout} className="logout-button">登出</button>
      )}

      <div className="chatroom">
        <div className="messages-container">
          {messages.map((msg, index) => (
            <div key={index} className="message">
              <span>{msg.sender}: {msg.text}</span>
            </div>
          ))}
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
        </div>)
        }
        
      </div>
      

      {showRegisterModal && (
        <AuthModal title="註冊" onSubmit={(userData) => handleAuth("register", userData)} onClose={() => setShowRegisterModal(false)} />
      )}

      {showLoginModal && (
        <AuthModal title="登入" onSubmit={(userData) => handleAuth("login", userData)} onClose={() => setShowLoginModal(false)} />
      )}
    </div>
  );
};

const ErrorModal = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);

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
