import logoNavbar from "../../assets/logoNavbar.svg";
import styled from "styled-components";
import { alertNavIcon } from "../../assets/AllIcon";
import { useState } from "react";

const Button = styled.button`
  width: 40%;
  display: inline-block;
  height: 2.5rem;
  background-color: white;
  border: none;

  &:focus {
    outline: none;
    border-bottom: 2px solid #000000;
  }
`;

const NavbarWithoutSearch = () => {
  const [navButton, setNavButton] = useState(0);
  const alertButton = alertNavIcon();
  return (
    <nav className="nav">
      <span className="logo">
        <img src={logoNavbar} />
      </span>
      <span className="searchAndIcon">
        <Button
          onClick={() => {
            setNavButton(2);
            console.log("alert!");
          }}
        >
          {alertButton}
        </Button>
      </span>
    </nav>
  );
};

export default NavbarWithoutSearch;
