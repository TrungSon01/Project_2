import { Button, Checkbox, Form, Input, Row, Col } from "antd";
import { loginService } from "../apis/userService";
import { useDispatch } from "react-redux";
import { setUserAction } from "../redux/userSlice";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "./Login.css";
// dispatch với use selector
export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // jsx = html + js
  const handleLogin = (email, password) => {
    loginService({ email, password })
      .then((user) => {
        // Nếu tìm thấy user, dispatch và navigate
        dispatch(setUserAction(user));
        navigate("/");
        toast.success("đăng nhập thành công");
      })
      .catch((err) => {
        // Nếu không tìm thấy user hoặc có lỗi
        console.error("Lỗi khi đăng nhập:", err);
        toast.error("đăng nhập thất bại");
      });
  };

  const onFinish = (values) => {
    console.log("Received values of form: ", values);

    handleLogin(values.email, values.password);
  };

  return (
    <div className="login-container shadow transition-shadow duration-300 hover:shadow-lg">
      <Form
        name="login"
        initialValues={{}}
        onFinish={onFinish}
        className="login-form"
      >
        <h2 className="login-title">Đăng nhập</h2>

        <Form.Item
          name="email"
          rules={[{ required: true, message: "Vui lòng nhập email!" }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Nhập email"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Nhập mật khẩu"
            size="large"
          />
        </Form.Item>

        <Form.Item>
          <Button
            block
            type="primary"
            htmlType="submit"
            className="login-button"
          >
            Đăng nhập
          </Button>
        </Form.Item>

        <a href="/register" className="login-link">
          Bạn chưa có tài khoản? <strong>Đăng ký</strong>
        </a>
        <a href="/" className="login-link">
          xem trước
        </a>
      </Form>
    </div>
  );
}
