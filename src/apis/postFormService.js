import { https } from "./config";

export const getPosts = async () => {
  try {
    const response = await https.get("api/posts/");
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

export const createPost = async (postData) => {
  try {
    const response = await https.post("api/posts/", postData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi chi tiết từ backend:", error.response?.data);
    throw error;
  }
};

export const deletePost = async (id) => {
  try {
    const response = await https.delete(`/api/posts/${id}`);
    return response.data;
  } catch (err) {
    console.log("delete err", err);
    throw err;
  }
};

export const getComments = async (post_id) => {
  try {
    const response = await https.get(`/api/posts/${post_id}/comments/`);
    return response.data;
  } catch (err) {
    console.error("Error fetching comments:", err);
    throw err;
  }
};

export const createComment = async (post_id, data) => {
  try {
    const response = await https.post(`/api/posts/${post_id}/comments/`, data);
    return response.data;
  } catch (err) {
    console.error("Error creating comment:", err);
    throw err;
  }
};

export const savePost = async (postId) => {
  try {
    const userAccount = JSON.parse(localStorage.getItem("userAccount"));
    const userId = userAccount ? userAccount.user_id : null;

    if (!userId) {
      throw new Error("User ID not found in local storage.");
    }

    const payload = {
      user_id: userId,
      post_id: postId,
    };

    const response = await https.post(`/api/posts/${postId}/save/`, payload);
    return response.data;
  } catch (error) {
    console.error("Error saving post:", error);
    throw error;
  }
};

export const getSavedPosts = async (userId) => {
  try {
    const response = await https.get(`/api/users/${userId}/save/posts/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching saved posts:", error);
    throw error;
  }
};

// function
export function timeAgo(ts) {
  const time = new Date(ts).getTime(); // ✅ Chuyển ISO string → timestamp
  const now = Date.now();
  const diff = Math.floor((now - time) / 60000); // phút

  if (diff < 1) return "Vừa xong";
  if (diff < 60) return `${diff} phút trước`;
  if (diff < 1440) return `${Math.floor(diff / 60)} giờ trước`;
  return `${Math.floor(diff / 1440)} ngày trước`;
}
