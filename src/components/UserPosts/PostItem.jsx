// components/Post/PostItem.jsx
import React from "react";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostActions from "./PostActions";
// import CommentsList from "./CommentsList";
// import CommentForm from "./CommentForm";

export default function PostItem({
  post,
  user,
  userEmail,
  onDelete,
  onEdit,
  onClick,
}) {
  return (
    <div className="post-item">
      <PostHeader
        post={post}
        user={user}
        onDelete={onDelete}
        onEdit={onEdit}
        userEmail={userEmail}
      />
      <PostContent post={post} />
      <PostActions post={post} />
      {/* Bình luận chỉ hiển thị trong PostDetail modal */}
      <button className="post-detail-btn" onClick={() => onClick(post)}>
        Xem chi tiết
      </button>
    </div>
  );
}
