// components/Post/CommentForm.jsx
import React, { useState } from "react";

export default function CommentForm({ postId }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      console.log(`Comment for post ${postId}:`, text);
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
      <input
        type="text"
        placeholder="Viết bình luận..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-amber-500"
      />
      <button
        type="submit"
        className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 transition"
      >
        Đăng
      </button>
    </form>
  );
}
