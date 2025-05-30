import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { getNotifications } from "../../apis/notificationService";
import { FaBell } from "react-icons/fa";
import "./Notification.css";

// Notification component: Hiển thị thông báo khi click chuông, dropdown xuất hiện bên phải chuông (dùng Portal)
export default function Notification({ onNotificationClick }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const closeTimer = useRef(null);
  const bellRef = useRef(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

  // Lấy danh sách thông báo từ backend
  const fetchNotifications = async () => {
    const userAccount = JSON.parse(localStorage.getItem("userAccount") || "{}");
    const user_id = userAccount.user_id;
    if (!user_id) return;
    setLoading(true);
    try {
      const data = await getNotifications(user_id);
      setNotifications(data);
      setUnread(data.filter((n) => !n.read_status).length);
    } catch {
      setNotifications([]);
      setUnread(0);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý click chuông: mở/đóng dropdown và fetch nếu mở
  const handleBellClick = () => {
    if (!open) {
      fetchNotifications();
      setTimeout(() => {
        if (bellRef.current) {
          const rect = bellRef.current.getBoundingClientRect();
          setDropdownPos({
            top: rect.top + window.scrollY,
            left: rect.right + 8 + window.scrollX,
          });
        }
      }, 0);
      startAutoCloseTimer();
    } else {
      clearAutoCloseTimer();
    }
    setOpen((prev) => !prev);
  };

  // Xử lý click vào 1 thông báo
  const handleNotificationClick = (post_id) => {
    setOpen(false);
    if (onNotificationClick) onNotificationClick(post_id);
    clearAutoCloseTimer();
  };

  // Tự động đóng dropdown sau 10s nếu không hover
  const startAutoCloseTimer = () => {
    clearAutoCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), 10000);
  };
  const clearAutoCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  // Khi hover vào dropdown thì dừng timer, khi rời chuột thì restart timer
  const handleDropdownMouseEnter = () => clearAutoCloseTimer();
  const handleDropdownMouseLeave = () => startAutoCloseTimer();

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (
        bellRef.current &&
        !bellRef.current.contains(e.target) &&
        document.getElementById("notification-portal") &&
        !document.getElementById("notification-portal").contains(e.target)
      ) {
        setOpen(false);
        clearAutoCloseTimer();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Tạo node portal nếu chưa có
  useEffect(() => {
    let portal = document.getElementById("notification-portal");
    if (!portal) {
      portal = document.createElement("div");
      portal.id = "notification-portal";
      document.body.appendChild(portal);
    }
  }, []);

  return (
    <div className="notification-wrap">
      <button
        className="notification-bell"
        onClick={handleBellClick}
        ref={bellRef}
      >
        <FaBell size={22} />
        {unread > 0 && <span className="notification-badge">{unread}</span>}
      </button>
      {open &&
        createPortal(
          <div
            className="notification-dropdown-right animate-fade-in"
            style={{
              position: "absolute",
              top: dropdownPos.top,
              left: dropdownPos.left,
              zIndex: 9999,
            }}
            onMouseEnter={handleDropdownMouseEnter}
            onMouseLeave={handleDropdownMouseLeave}
          >
            <div className="notification-title">Thông báo</div>
            {loading ? (
              <div className="notification-loading">Đang tải...</div>
            ) : notifications.length === 0 ? (
              <div className="notification-empty">Không có thông báo nào.</div>
            ) : (
              <ul className="notification-list">
                {notifications.map((n) => (
                  <li
                    key={n.noti_id}
                    className={
                      "notification-item" + (!n.read_status ? " unread" : "")
                    }
                    onClick={() => handleNotificationClick(n.post_id)}
                  >
                    <div className="notification-content">{n.message}</div>
                    <div className="notification-time">{n.created_at}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>,
          document.getElementById("notification-portal")
        )}
    </div>
  );
}
