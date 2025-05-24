// components/Post/PostHeader.jsx
import React, { useState } from "react";
import { SlOptionsVertical } from "react-icons/sl";

const defaultAvatar =
  "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";
import { timeAgo } from "../../apis/postFormService";

export default function PostHeader({
  post,
  user,
  userEmail,
  onDelete,
  onEdit,
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="post-header">
      <div className="post-avatar-block">
        <img
          src={defaultAvatar}
          alt="avatar"
          className="avatar"
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
        <div>
          <div className="post-author text-gray-700">
            {userEmail || `Người dùng #${post.user_id}`}
          </div>
          <div className="post-time">
            {post.post_time ? timeAgo(post.post_time) : ""}
          </div>
        </div>
      </div>
      <div className="post-dropdown-wrapper">
        <button className="post-dropdown-btn" onClick={() => setOpen(!open)}>
          <SlOptionsVertical size={18} color="gray" />
        </button>
        {open && (
          <div className="post-dropdown-menu">
            <div className="post-dropdown-item" onClick={onEdit}>
              Chỉnh sửa
            </div>
            {post.user_id === user?.user_id && (
              <div
                className="post-dropdown-item"
                onClick={() => onDelete(post.post_id)}
              >
                Xóa
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
