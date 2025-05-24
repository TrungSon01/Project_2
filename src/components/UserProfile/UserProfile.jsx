import React from "react";
import { useSelector } from "react-redux";
import { FaPen } from "react-icons/fa";
import "./UserProfile.css";
export default function UserProfile() {
  const user = useSelector((state) => state.userSlice.user); // lấy từ Redux

  if (!user) return <div>Đang tải hồ sơ...</div>;

  const fullName =
    user.fullname || `${user.firstName || ""} ${user.lastName || ""}`.trim();

  return (
    <div className="user-profile">
      <h2>Hồ sơ của bạn</h2>
      <div className="avatar-block">
        <div className="avatar">
          <span role="img" aria-label="camera">
            📷
          </span>
        </div>
        <div className="user-id">ID: {user.id}</div>
        <div className="user-name">
          {fullName || "Chưa có tên"} <FaPen className="icon" />
        </div>
      </div>
      <div className="user-info">
        <div>
          <b>Email:</b> {user.email} <FaPen className="icon" />
        </div>
        <div>
          <b>Vai trò:</b> {user.role === false ? "Người dùng" : "Quản trị viên"}
        </div>
        <div className="change-password">
          <a href="#">Đổi mật khẩu?</a>
        </div>
      </div>
    </div>
  );
}
