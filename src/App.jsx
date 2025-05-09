import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import HomePage from "./Homepage/HomePage";
import LoginForm from "./Login&Register/LoginForm";
import { Toaster } from "react-hot-toast"; // Import Toaster ở đây
import RegisterForm from "./Login&Register/RegisterForm";

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
