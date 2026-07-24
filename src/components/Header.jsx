import { Link } from "react-router-dom";
import logo from "../assets/imgs/logo.png";

function Header() {
  return (
    <header className="d-lg-none bg-main p-3 py-3 shadow container-fluid">
      <div className="row justify-content-between">
        <div className="col-2 d-flex gap-3 align-items-center">
          <Link to="/Cart">
            <i className="fa-solid fa-cart-shopping fa-xl text-black"></i>
          </Link>
          <i className="fa-solid fa-magnifying-glass fa-xl"></i>
        </div>
        <div className="col-6 d-flex align-items-center justify-content-center gap-2">
          <Link to="/" className="d-flex align-items-center gap-2 text-black">
            <h1 className="fs-4 fw-bold text-nowrap d-none d-sm-block">Alghoul - الغول</h1>
            <img src={logo} alt="ghoul logo" className="logo" />
          </Link>
        </div>
        <div className="col-2 d-flex align-items-center justify-content-end">
          <Link to="/Login">
            <i className="fa-solid fa-user fa-xl text-black"></i>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
