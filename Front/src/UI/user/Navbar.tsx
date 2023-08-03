import logoNavbar from "../../assets/logoNavbar.svg";
import styled from "styled-components";
import { alertNavIcon, resetUserInfo } from "../../assets/AllIcon";
import { useState } from "react";

const Button = styled.button`
  width: 40%;
  display: inline-block;
  height: 2.5rem;
  background-color: white;
  border: none;
`;

const Navbar = (props: { modalHandler: () => void }) => {
  const alertButton = alertNavIcon();
  const resetIcon = resetUserInfo();
  return (
    <nav className="nav">
      <span className="logo">
        <img src={logoNavbar} />
      </span>
      <span>
        <Button onClick={props.modalHandler.bind(true)}>{resetIcon}</Button>
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
