import React from "react";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaPlus,
  FaBell,
  FaBookmark,
} from "react-icons/fa";
import styled from "styled-components";
import UserMenu from "../UserMenu/UserMenu";
import { FaHouseChimney } from "react-icons/fa6";
import { useNavigate } from "react-router";
import HomePage from "../../HomePage/HomePage";
const NavbarContainer = styled.div`
  position: fixed;
  height: 100vh;
  width: 80px;
  background-color: #ffffff;
  border-right: 1px solid #dddddd;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
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

const TopSection = styled.div``;
const CenterSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Navbar = ({ onCreatePost }) => {
  const navigate = useNavigate();

  return (
    <NavbarContainer>
      <TopSection>
        <UserMenu />
      </TopSection>

      <CenterSection>
        <IconButton onClick={() => navigate("/")}>
          <FaHouseChimney />
        </IconButton>
        <IconButton onClick={() => console.log(Date.now())}>
          <FaSearch />
        </IconButton>
        <IconButton>
          <FaMapMarkerAlt />
        </IconButton>
        <IconButton onClick={() => navigate("/create-post")}>
          <FaPlus />
        </IconButton>
        <IconButton>
          <FaBell />
        </IconButton>
        <IconButton>
          <FaBookmark />
        </IconButton>
      </CenterSection>
    </NavbarContainer>
  );
};

export default Navbar;
