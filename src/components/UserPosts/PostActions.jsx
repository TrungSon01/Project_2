// components/Post/PostActions.jsx
import React, { useState } from "react";

export default function PostActions({ post }) {
  const [liked, setLiked] = useState(false);

  const handleLike = () => setLiked(!liked);

  return (
    <div className="post-actions">
      <button onClick={handleLike}>{liked ? "❤️ Đã thích" : "🤍 Thích"}</button>
    </div>
  );
}
