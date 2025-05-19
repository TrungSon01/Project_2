import { createSlice } from "@reduxjs/toolkit";
import { getPosts, deletePost } from "../apis/postFormService";

const postSlice = createSlice({
  name: "postSlice",
  initialState: {
    posts: [],
    loading: true,
  },
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
      state.loading = false;
    },
    deletePost: (state, action) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setPosts, deletePostById, setLoading } = postSlice.actions;
export default postSlice.reducer;
