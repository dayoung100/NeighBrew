import logo from "../../assets/logo.png";
import styled from "styled-components";
import { alertNavIcon, resetUserInfo, searchNavIcon } from "../../assets/AllIcon";
import { useNavigate } from "react-router-dom";

const NavCustom = styled.nav`
  display: flex;
  justify-content: space-between;
  padding: 2% 0;
  background-color: white;
  width: 100%;
`;

const BtnDiv = styled.div`
  width: 20%;
  max-width: 20%;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: end;
`;

const Button = styled.button`
  background-color: white;
  border: none;
`;

const Logo = styled.div`
  width: 60%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Navbar = () => {
  const alertButton = alertNavIcon();
  const resetIcon = resetUserInfo();
  const searchButton = searchNavIcon();
  const navigate = useNavigate();
  const UserSearchHandler = () => {
    navigate("/userSearch");
  };
  const GotoAlertHandler = () => {
    navigate("/myPage/alarm");
  };
  const GotoHomeHandler = () => {
    navigate("/");
  };
  return (
    <NavCustom>
      <BtnDiv></BtnDiv>
      <Logo onClick={GotoHomeHandler}>
        <img src={logo} width="50%" />
      </Logo>
      <BtnDiv style={{ paddingRight: "0.5rem" }}>
        <Button onClick={UserSearchHandler}>{searchButton}</Button>
        <Button onClick={GotoAlertHandler}>{alertButton}</Button>
      </BtnDiv>
    </NavCustom>
  );
};

export default Navbar;
