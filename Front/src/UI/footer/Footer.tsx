import styled from "styled-components";
import {
  breweryFooterIcon,
  chatFooterIcon,
  meetingFooterIcon,
  myPageFooterIcon,
} from "../../assets/AllIcon";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Button = styled.button<{ now: number; choosebutton: number }>`
  width: 40%;
  display: inline-block;
  height: 3.5rem;
  background-color: white;
  border: none;
  margin: 0 auto 2px auto;
`;

const Footer = () => {
  const [chooseMenu, setChooseMenu] = useState(0);
  const meetingIcon = meetingFooterIcon(chooseMenu === 0 ? "black" : "#AAAAAA");
  const breweryIcon = breweryFooterIcon(chooseMenu === 1 ? "black" : "#AAAAAA");
  const chatIcon = chatFooterIcon(chooseMenu === 2 ? "black" : "#AAAAAA");
  const myIcon = myPageFooterIcon(chooseMenu === 3 ? "black" : "#AAAAAA");
  const navigate = useNavigate();
  const userid = localStorage.getItem("myId");
  const chooseMenuHandler = (num: number) => {
    setChooseMenu(num);
    localStorage.setItem("chooseMenu", num.toString());
  };

  useEffect(() => {
    setChooseMenu(parseInt(localStorage.getItem("chooseMenu") || "0"));
  }, []);
  return (
    <footer className="footer">
      <Button
        onClick={() => {
          chooseMenuHandler(0);
          navigate("/meet");
        }}
        now={0}
        choosebutton={chooseMenu}
      >
        {meetingIcon}
      </Button>
      <Button
        onClick={() => {
          chooseMenuHandler(1);
          navigate("/drinkpost");
        }}
        now={1}
        choosebutton={chooseMenu}
      >
        {breweryIcon}
      </Button>
      <Button
        onClick={() => {
          chooseMenuHandler(2);
          navigate("/chatList");
        }}
        now={2}
        choosebutton={chooseMenu}
      >
        {chatIcon}
      </Button>
      <Button
        onClick={() => {
          chooseMenuHandler(3);
          navigate(`/myPage/${userid}`);
        }}
        now={3}
        choosebutton={chooseMenu}
      >
        {myIcon}
      </Button>
    </footer>
  );
};
export default Footer;
