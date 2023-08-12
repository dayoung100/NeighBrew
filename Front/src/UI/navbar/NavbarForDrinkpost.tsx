// 술장 기능을 위한 navbar입니다. 다른 파트분들은 신경쓰지 마세요.

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
    border-bottom: 2px solid #000000;
  }
`;

type toDrinkpSearchProps = {
  toDrinkSearch: any;
};

const Navbar = (props: toDrinkpSearchProps) => {
  const [navButton, setNavButton] = useState(0);
  const searchButton = searchNavIcon();
  const alertButton = alertNavIcon();
  return (
    <nav className="nav" style={{ width: "100%" }}>
      <span className="logo">
        <img src={logoNavbar} />
      </span>
      <span className="searchAndIcon">
        <Button
          onClick={() => {
            setNavButton(1);
            props.toDrinkSearch();
            // console.log("search!");
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
