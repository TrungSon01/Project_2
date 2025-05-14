import React from "react";
import RegisterForm from "../Login&Register/RegisterForm";
import LoginPage from "../Login&Register/LoginForm";
import PostForm from "../user/PostForm/PostForm";
import { useNavigate } from "react-router";
import { useEffect } from "react";
export default function HomePage() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("userAccount");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);
  return (
    <div>
      <PostForm></PostForm>
    </div>
  );
}
