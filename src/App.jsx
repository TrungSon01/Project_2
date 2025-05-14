import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import HomePage from "./HomePage/HomePage";
import LoginForm from "./Login&Register/LoginForm";
import { Toaster } from "react-hot-toast"; // Import Toaster ở đây
import RegisterForm from "./Login&Register/RegisterForm";
import Loading from "./components/Loading/Loading";
import Template from "./template/Template";

function App() {
  return (
    <div>
      <Loading />
      <BrowserRouter>
        <Toaster />
        <Routes>
          <Route path="/" element={<Template content={<HomePage />} />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
