import React, { useState } from "react";
import {
  FaUserCircle,
  FaMapMarkerAlt,
  FaSearch,
  FaBell,
  FaPlus,
  FaBookmark,
} from "react-icons/fa";
import styled from "styled-components";

const NavbarContainer = styled.div`
  position: fixed;
  height: 100vh;
  width: 80px;
  background-color: #ffffff;
  border-right: 1px solid #dddddd;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
`;

const IconButton = styled.div`
  margin: 20px 0;
  font-size: 24px;
  color: #000;
  cursor: pointer;

  &:hover {
    color: #555;
  }
`;

const AvatarMenu = styled.div`
  position: absolute;
  top: 90px;
  left: 90px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  min-width: 180px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 5px;

  p {
    margin: 0;
    padding: 8px 0;
    border-bottom: 1px solid #ddd;
    white-space: nowrap;
  }

  p:last-child {
    border-bottom: none;
  }
`;

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);

  const handleAvatarClick = () => {
    setShowMenu(!showMenu);
  };

  const handleLogout = () => {
    console.log("Đăng xuất");
  };

  return (
    <NavbarContainer>
      <IconButton onClick={handleAvatarClick}>
        <FaUserCircle />
      </IconButton>
      {showMenu && (
        <AvatarMenu>
          <p>Thông tin tài khoản</p>
          <p onClick={handleLogout}>Đăng xuất</p>
        </AvatarMenu>
      )}
      <IconButton>
        <FaSearch />
      </IconButton>
      <IconButton>
        <FaMapMarkerAlt />
      </IconButton>
      <IconButton>
        <FaPlus />
      </IconButton>
      <IconButton>
        <FaBell />
      </IconButton>
      <IconButton>
        <FaBookmark />
      </IconButton>
    </NavbarContainer>
  );
};

export default Navbar;
