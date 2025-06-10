import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage/HomePage";
import LoginForm from "./Login&Register/LoginForm";
import { Toaster } from "react-hot-toast";
import RegisterForm from "./Login&Register/RegisterForm";
import Loading from "./components/Loading/Loading";
import Template from "./template/Template";
import NotFoundPage from "./components/NotFoundPage/NotFoundPage";
import PostForm from "./user/PostForm/PostForm";
import ProfileUser from "./components/UserProfile/UserProfile";
import SavedPostsPage from "./user/SavedPostsPage/SavedPostsPage";
import React, { useRef } from "react";
import Notification from "./components/Notification/Notification";

function App() {
  const homePageRef = useRef();

  // Handler to open post detail from notification
  const handleNotificationPostClick = (post_id) => {
    if (homePageRef.current && homePageRef.current.openPostDetailById) {
      homePageRef.current.openPostDetailById(post_id);
    }
  };

  return (
    <div>
      <Loading />
      <BrowserRouter>
        <Toaster />
        <Routes>
          <Route
            path="/"
            element={
              <Template
                content={<HomePage ref={homePageRef} />}
                onNotificationPostClick={handleNotificationPostClick}
              />
            }
          />
          <Route
            path="/create-post"
            element={<Template content={<PostForm />} />}
          />
          <Route
            path="/profile"
            element={<Template content={<ProfileUser />} />}
          />
          <Route
            path="/saved-posts"
            element={<Template content={<SavedPostsPage />} />}
          />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/notic" element={<Notification />} />
          <Route path="/*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
