import { NavLink } from "react-router-dom";

// في main.js الأصلي كان فيه كود بيدور على الـ link اللي بيطابق الصفحة الحالية
// ويضيفله class="active-nav" يدوي. في React، NavLink بيعمل ده جاهز:
// بيديلنا isActive تلقائي من غير ما نكتب أي منطق إضافي

function Navbar() {
  const linkClass = ({ isActive }) =>
    `text-black d-flex flex-column align-items-center justify-content-center${
      isActive ? " active-nav" : ""
    }`;

  return (
    <nav className="d-lg-none fixed-bottom border-top border-2 py-1 shadow bg-light px-2">
      <ul className="d-flex justify-content-around pt-3 mb-0 list-unstyled">
        <li className="fs-5 text-black">
          <NavLink to="/orders" className={linkClass}>
            <i className="fa-solid fa-receipt"></i>
            <p>طلباتي</p>
          </NavLink>
        </li>
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
          <NavLink to="/shop" className={linkClass}>
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
