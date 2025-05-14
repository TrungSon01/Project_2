import React, { useEffect, useState } from "react";
import { Avatar, Dropdown } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/userSlice"; // <-- import action

export default function UserMenu() {
  const [userInfo, setUserInfo] = useState(null);
  const { user } = useSelector((state) => state.userSlice);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("USER"));
    if (user) {
      setUserInfo(user);
    }
  }, [user]);

  const handleLogout = () => {
    // 1. Xóa Redux
    dispatch(logoutUser());

    // 2. Xóa localStorage
    localStorage.removeItem("USER");

    // 3. Điều hướng về trang login
    navigate("/login&register");
  };

  const items = [
    {
      key: "1",
      label: <span>Tên: {user?.hoTen}</span>,
    },
    ...(user?.maLoaiNguoiDung === "QuanTri"
      ? [
          {
            key: "2",
            label: (
              <span onClick={() => navigate("/admin")}>Trang quản lý</span>
            ),
          },
        ]
      : []),
    {
      key: "3",
      label: <span onClick={handleLogout}>Đăng xuất</span>,
    },
  ];

  if (!user) return null;

  return (
    <div className="flex justify-end p-4">
      <Dropdown
        menu={{ items }}
        placement="bottomRight"
        arrow
        trigger={["click"]}
      >
        <Avatar
          size="large"
          icon={<UserOutlined />}
          className="cursor-pointer"
        />
      </Dropdown>
    </div>
  );
}
