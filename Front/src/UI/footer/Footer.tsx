import footerChat from '../../assets/footerChat.svg';
import footerMypage from '../../assets/footerMypage.svg';
import footerGroup from '../../assets/footerDrinkpost.svg';
import footerDrinkpost from '../../assets/footerGroup.svg';

const Footer = () => {
  return (
    <footer className="footer">
      <img src={footerGroup} alt="" />
      <img src={footerDrinkpost} alt="" />
      <img src={footerChat} alt="" />
      <img src={footerMypage} alt="" />
    </footer>
  );
};
export default Footer;
