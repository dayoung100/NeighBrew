import logoNavbar from "../../assets/logoNavbar.svg";
import styled from "styled-components";
import {
  alertNavIcon,
  resetUserInfo,
  searchNavIcon,
} from "../../assets/AllIcon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Button = styled.button`
  /* width: 40%; */
  display: inline-block;
  height: 2.5rem;
  background-color: white;
  border: none;
`;

const Navbar = () => {
  const alertButton = alertNavIcon();
  const resetIcon = resetUserInfo();
  const searchButton = searchNavIcon();
  const navigate = useNavigate();
  const UserSearchHandler = () => {
    navigate("/userSearch");
  };
  return (
    <nav className="nav">
      <span className="logo">
        <img src={logoNavbar} />
      </span>
      <span>
        <Button onClick={UserSearchHandler}>{searchButton}</Button>
        <Button
          onClick={() => {
            console.log("alert!");
          }}
        >
          {alertButton}
        </Button>
      </span>
    </nav>
  );
};

export default Navbar;
