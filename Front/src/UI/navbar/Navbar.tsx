import logoImage from '../../assets/logoNavbar.svg';
import iconAlert from '../../assets/iconAlert.svg';
import iconSearch from '../../assets/iconSearch.svg';

const Navbar = () => {
  return (
    <nav className="nav">
      <span className="logo">
        <img src={logoImage} />
      </span>
      <span className="searchAndIcon">
        <img src={iconSearch} />
        <img src={iconAlert} />
      </span>
    </nav>
  );
};

export default Navbar;
