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
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, chooseMenu } from "../../store";

const Button = styled.button<{ now: number; chooseButton: number }>`
  width: 40%;
  display: inline-block;
  height: 3rem;
  background-color: white;
  border: none;
  margin: 1rem auto;
  border-bottom: ${props => (props.now == props.chooseButton ? "2px solid #000000" : "none")};
`;

const Footer = () => {
  const redux = useSelector((state: RootState) => state);
  const dispatch = useDispatch();
  const meetingIcon = meetingFooterIcon(redux.chooseMenu.value === 0 ? "black" : "#AAAAAA");
  const breweryIcon = breweryFooterIcon(redux.chooseMenu.value === 1 ? "black" : "#AAAAAA");
  const chatIcon = chatFooterIcon(redux.chooseMenu.value === 2 ? "black" : "#AAAAAA");
  const myIcon = myPageFooterIcon(redux.chooseMenu.value === 3 ? "black" : "#AAAAAA");
  const navigate = useNavigate();
  const temp = () => {
    // if (redux.chooseMenu.value === undefined) return;
    dispatch(chooseMenu(0));
    navigate("/meet");
  };
  return (
    <footer className="footer">
      <Button
        onClick={() => {
          dispatch(chooseMenu(0));
          navigate("/meet");
        }}
        now={0}
        chooseButton={redux.chooseMenu.value}
      >
        {meetingIcon}
      </Button>
      <Button
        onClick={() => {
          dispatch(chooseMenu(1));
          navigate("/drinkpost");
        }}
        now={1}
        chooseButton={redux.chooseMenu.value}
      >
        {breweryIcon}
      </Button>
      <Button
        onClick={() => {
          dispatch(chooseMenu(2));
          navigate("/chatList");
        }}
        now={2}
        chooseButton={redux.chooseMenu.value}
      >
        {chatIcon}
      </Button>
      <Button
        onClick={() => {
          dispatch(chooseMenu(3));
          navigate("/myPage/1");
        }}
        now={3}
        chooseButton={redux.chooseMenu.value}
      >
        {myIcon}
      </Button>
    </footer>
  );
};
export default Footer;
