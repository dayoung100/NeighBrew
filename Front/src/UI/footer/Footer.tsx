// import footerChat from '../../assets/footerChat.svg';
// import footerMypage from '../../assets/footerMypage.svg';
// import footerGroup from '../../assets/footerDrinkpost.svg';
// import footerDrinkpost from '../../assets/footerGroup.svg';
import styled from "styled-components";
import {
  breweryFooterIcon,
  chatFooterIcon,
  meetingFooterIcon,
  myPageFooterIcon,
} from "../../assets/AllIcon";
import { useState } from "react";

const Button = styled.button`
  width: 40%;
  display: inline-block;
  height: 3rem;
  background-color: white;
  border: none;
  margin: 1rem auto;
  &:focus {
    outline: none;
    border-bottom: 2px solid #000000;
  }
`;

const Footer = () => {
  const [chooseButton, setChooseButton] = useState(0);
  const meetingIcon = meetingFooterIcon(chooseButton === 0 ? "black" : "#AAAAAA");
  const breweryIcon = breweryFooterIcon(chooseButton === 1 ? "black" : "#AAAAAA");
  const chatIcon = chatFooterIcon(chooseButton === 2 ? "black" : "#AAAAAA");
  const myIcon = myPageFooterIcon(chooseButton === 3 ? "black" : "#AAAAAA");

  return (
    <footer className="footer">
      <Button
        onClick={() => {
          setChooseButton(0);
        }}
        autoFocus
      >
        {meetingIcon}
      </Button>
      <Button
        onClick={() => {
          setChooseButton(1);
        }}
      >
        {breweryIcon}
      </Button>
      <Button
        onClick={() => {
          setChooseButton(2);
        }}
      >
        {chatIcon}
      </Button>
      <Button
        onClick={() => {
          setChooseButton(3);
        }}
      >
        {myIcon}
      </Button>
    </footer>
  );
};
export default Footer;
