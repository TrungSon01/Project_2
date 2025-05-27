import React, { useEffect, useState } from "react";
import "./UserProfile.css";
import { getUserById } from "../../apis/userService";

const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userAccount = JSON.parse(localStorage.getItem("userAccount") || "{}");
    const user_id = userAccount.user_id;
    if (!user_id) {
      setError("Không tìm thấy user_id. Vui lòng đăng nhập lại.");
      setLoading(false);
      return;
    }
    setLoading(true);
    getUserById(user_id)
      .then((res) => setUser(res.data))
      .catch(() => setError("Không thể tải thông tin người dùng."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="user-profile-loading">
        <div className="user-profile-spinner" />
        Đang tải thông tin người dùng...
      </div>
    );
  }
  if (error) {
    return <div className="user-profile-error">{error}</div>;
  }
  if (!user) return null;

  return (
    <div className="user-profile-bg">
      <div className="user-profile-card animate-pop">
        <div className="user-profile-avatar-wrap">
          <img
            src={user.avatar || defaultAvatar}
            alt="avatar"
            className="user-profile-avatar"
          />
        </div>
        <h2 className="user-profile-name">{user.username || "Người dùng"}</h2>
        <div className="user-profile-info">
          <div>
            <b>Email:</b> <span>{user.email}</span>
          </div>
          <div>
            <b>Số điện thoại:</b> <span>{user.phone || "Chưa cập nhật"}</span>
          </div>
          <div>
            <b>User ID:</b> <span>{user.user_id}</span>
          </div>
        </div>
        <div className="user-profile-actions">
          <button className="user-profile-btn">Chỉnh sửa</button>
          <button className="user-profile-btn user-profile-btn-logout">
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}
