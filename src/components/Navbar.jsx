import { NavLink, useLocation } from "react-router-dom";

function Navbar() {
  const linkClass = ({ isActive }) =>
    `text-black d-flex flex-column align-items-center justify-content-center${isActive ? " active-nav" : ""
    }`;

  const location = useLocation();

  return (
    <nav className="d-lg-none fixed-bottom border-top border-2 py-1 shadow bg-light px-2">
      <ul className="d-flex justify-content-around pt-3 mb-0 list-unstyled">
        <li className="fs-5 text-black">
          <NavLink to="/wishlist" className={linkClass}>
            <i className="fa-regular fa-heart"></i>
            <p>المفضلة</p>
          </NavLink>
        </li>
        <li className="fs-5 text-black">
          <NavLink to="/chatbot" className={linkClass}>
            <i className="fa-solid fa-robot"></i>
            <p>المساعد</p>
          </NavLink>
        </li>
        <li className="fs-5 text-black">
          <NavLink to="/shop" className={({ isActive }) =>
            linkClass({
              isActive:
                isActive ||
                location.pathname.startsWith("/SubCategories/") ||
                location.pathname.startsWith("/Products/") ||
                location.pathname.startsWith("/product/"),
            })}>
            <i className="fa-solid fa-shop"></i>
            <p>المتجر</p>
          </NavLink>
        </li>
        <li className="fs-5 text-black">
          <NavLink to="/" className={linkClass} end>
            <i className="fa-regular fa-home"></i>
            <p>الرئيسية</p>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
