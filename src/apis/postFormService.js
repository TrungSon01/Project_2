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
    const response = await https.get(`/api/comments/?post_id=${post_id}`);
    return response.data;
  } catch (err) {
    console.error("Error fetching comments:", err);
    throw err;
  }
};

export const createComment = async (data) => {
  try {
    const response = await https.post(`/api/comments/`, data);
    return response.data;
  } catch (err) {
    console.error("Error creating comment:", err);
    throw err;
  }
};

// function
export function timeAgo(ts) {
  const diff = Math.floor((Date.now() - ts) / 60000);
  if (diff < 60) return `${diff} phút trước`;
  if (diff < 1440) return `${Math.floor(diff / 60)} giờ trước`;
  return `${Math.floor(diff / 1440)} ngày trước`;
}
