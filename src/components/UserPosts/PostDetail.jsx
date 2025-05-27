import React, { useState } from "react";
import "./PostDetail.css";
import { createComment, getComments } from "../../apis/postFormService";
import { useSelector } from "react-redux";
import CommentForm from "./CommentForm";
import { timeAgo } from "../../apis/postFormService";
export default function PostDetail({ post, comments, loading, onClose }) {
  const { user } = useSelector((state) => state.userSlice);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const [localComments, setLocalComments] = useState(comments);
  const [reload, setReload] = useState(false);

  React.useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSending(true);
    try {
      await createComment(post.id || post.post_id, {
        content: comment,
        sender_id: user?.user_id,
        receiver_id: post.user_id,
      });
      setComment("");
      // Reload comments
      const newComments = await getComments(post.id || post.post_id);
      setLocalComments(newComments);
    } catch (err) {
      // handle error
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="post-detail-modal">
      <div className="post-detail-content">
        <button className="post-detail-close" onClick={onClose}>
          &times;
        </button>
        <h2>Chi tiết bài đăng</h2>
        <div className="post-detail-main">
          <img src={post.image} alt="pet" className="post-detail-image" />
          <div className="post-detail-info">
            <div>
              <b>Email:</b>{" "}
              {post.email || post.userEmail || `User #${post.user_id}`}
            </div>
            <div>
              <b>Mô tả:</b> {post.description}
            </div>
            <div>
              <b>Loài:</b> {post.species}
            </div>
            <div>
              <b>Giống:</b> {post.breed}
            </div>
          </div>
        </div>
        <h3>Bình luận</h3>
        {loading ? (
          <div>Đang tải bình luận...</div>
        ) : localComments.length === 0 ? (
          <div>Chưa có bình luận nào.</div>
        ) : (
          <ul className="post-detail-comments">
            {localComments.map((cmt, index) => (
              <li
                key={`${cmt.cmt_id}-${cmt.created_at}-${index}`}
                className="post-detail-comment"
              >
                <div>
                  <b>Người gửi:</b>{" "}
                  {cmt.sender_email || `User #${cmt.sender_id}`}
                </div>
                <div>{cmt.content}</div>
                <div className="post-detail-comment-time">
                  {timeAgo(cmt.created_at)}
                </div>
              </li>
            ))}
          </ul>
        )}
        {user && (
          <CommentForm
            comment={comment}
            setComment={setComment}
            sending={sending}
            handleSend={handleSend}
          />
        )}
      </div>
    </div>
  );
}
