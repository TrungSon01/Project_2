import { https } from "./config";

export const getPosts = async () => {
  try {
    const response = await https.get("/posts");
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

export const createPost = async (postData) => {
  try {
    const response = await https.post("/posts", postData);
    return response.data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

export const deletePost = async (id) => {
  try {
    const response = await https.delete(`/posts/${id}`);
    return response.data;
  } catch (err) {
    console.log("delete err", err);
    throw error;
  }
};

// function
export function timeAgo(ts) {
  const diff = Math.floor((Date.now() - ts) / 60000);
  if (diff < 60) return `${diff} phút trước`;
  if (diff < 1440) return `${Math.floor(diff / 60)} giờ trước`;
  return `${Math.floor(diff / 1440)} ngày trước`;
}
