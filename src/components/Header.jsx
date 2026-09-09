import { Link } from "react-router-dom";
import logo from "../assets/imgs/logo.png";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";


function Header() {
  const { isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  return (
    <header className="d-lg-none bg-main p-3 py-3 shadow container-fluid">
      <div className="row justify-content-between">
        <div className="col-2 d-flex gap-3 align-items-center">
          <Link to="/Cart" className="text-dark position-relative">
            <i className="fa-solid fa-cart-shopping fa-xl"></i>
            {cartCount > 0 && (
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style={{ fontSize: "10px" }}
              >
                {cartCount}
              </span>
            )}
          </Link>
          <Link to="/search" className="text-dark">
            <i className="fa-solid fa-magnifying-glass fa-xl"></i>
          </Link>
        </div>
        <div className="col-6 d-flex align-items-center justify-content-center gap-2">
          <Link to="/" className="d-flex align-items-center gap-2 text-black">
            <h1 className="fs-4 fw-bold text-nowrap d-none d-sm-block">Alghoul - الغول</h1>
            <img src={logo} alt="ghoul logo" className="logo" />
          </Link>
        </div>
        <div className="col-2 d-flex align-items-center justify-content-end">
          <Link to={isAuthenticated ? "/profile" : "/Login"}>
            <i className="fa-solid fa-user fa-xl text-black"></i>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
