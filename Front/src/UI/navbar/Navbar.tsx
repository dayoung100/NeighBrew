import logoNavbar from "../../assets/logoNavbar.svg";
import styled from "styled-components";
import { searchNavIcon, alertNavIcon } from "../../assets/AllIcon";
import { useState } from "react";

const Button = styled.button`
  width: 40%;
  display: inline-block;
  height: 2.5rem;
  background-color: white;
  border: none;

  &:focus {
    outline: none;
    border-bottom: 0.125rem solid #000000;
  }
`;

const Navbar = () => {
  const [navButton, setNavButton] = useState(0);
  const searchButton = searchNavIcon();
  const alertButton = alertNavIcon();
  return (
    <nav className="nav">
      <span className="logo">
        <img src={logoNavbar} />
      </span>
      <span className="searchAndIcon">
        <Button
          onClick={() => {
            setNavButton(1);
            console.log("search!");
          }}
        >
          {searchButton}
        </Button>
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

export default Navbar;
