import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage/HomePage";
import LoginForm from "./Login&Register/LoginForm";
import { Toaster } from "react-hot-toast";
import RegisterForm from "./Login&Register/RegisterForm";
import Loading from "./components/Loading/Loading";
import Template from "./template/Template";
import NotFoundPage from "./components/NotFoundPage/NotFoundPage";
import PostForm from "./user/PostForm/PostForm"; // thêm dòng này
import ProfileUser from "./components/UserProfile/UserProfile";
function App() {
  return (
    <div>
      <Loading />
      <BrowserRouter>
        <Toaster />
        <Routes>
          <Route path="/" element={<Template content={<HomePage />} />} />
          <Route
            path="/create-post"
            element={<Template content={<PostForm />} />}
          />
          <Route
            path="/profile"
            element={<Template content={<ProfileUser />} />}
          />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
