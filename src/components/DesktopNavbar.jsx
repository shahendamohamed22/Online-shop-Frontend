import { NavLink, Link } from "react-router-dom";
import logo from "../assets/imgs/logo.png";

function DesktopNav() {
    const linkClass = ({ isActive }) =>
    `text-black ${
      isActive ? " active-nav" : ""
    }`;

    return (
        <header className="d-none d-lg-block bg-main shadow-sm fixed-top">
            <div className="container py-3">
                <div className="d-flex align-items-center justify-content-between">

                    {/* Logo */}
                    <Link
                        to="/"
                        className="text-decoration-none text-dark d-flex gap-3 align-items-center"
                    >
                        <img
                            src={logo}
                            alt="El Ghoul"
                            style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "contain",
                            }}
                        />

                        <div className="ms-2">
                            <h1 className="mb-0 fw-bold fs-4">
                                الغول - Alghoul
                            </h1>
                        </div>
                    </Link>

                    {/* Search */}

                    <div
                        className="mx-5 flex-grow-1"
                        style={{ maxWidth: "650px" }}
                    >
                        <div
                            className="input-group overflow-hidden"
                            style={{ borderRadius: "30px" }}
                        >
                            <input
                                type="text"
                                className="form-control border-end-0 py-2"
                                placeholder="Search products..."
                            />

                            <button
                                className="btn btn-light border border-start-0"
                            >
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </button>
                        </div>
                    </div>

                    {/* Icons */}

                    <div className="d-flex align-items-center gap-4">

                        <Link
                            to="/wishlist"
                            className="text-dark"
                        >
                            <i className="fa-regular fa-heart fs-4"></i>
                        </Link>

                        <Link
                            to="/cart"
                            className="text-dark position-relative"
                        >
                            <i className="fa-solid fa-cart-shopping fs-4"></i>

                        </Link>

                        <Link
                            to="/login"
                            className="text-dark"
                        >
                            <i className="fa-solid fa-user fs-4"></i>
                        </Link>

                    </div>

                </div>
            </div>

            {/* Bottom Navbar */}

            <div className="border-top border-opacity-50 bg-light">

                <div className="container">

                    <div className="d-flex justify-content-between align-items-center py-3">

                        <ul className="list-unstyled d-flex gap-5 mb-0">

                            <li className="fs-5">
                                <NavLink end to="/" className={linkClass}>
                                    <i className="fa-solid fa-house ms-2"></i>
                                    الرئيسية
                                </NavLink>
                            </li>

                            <li className="fs-5">
                                <NavLink to="/shop" className={linkClass}>
                                    <i className="fa-solid fa-shop ms-2"></i>
                                    المتجر
                                </NavLink>
                            </li>

                            <li className="fs-5">
                                <NavLink to="/wishlist" className={linkClass}>
                                    <i className="fa-regular fa-heart ms-2"></i>
                                    المفضلة
                                </NavLink>
                            </li>

                            <li className="fs-5">
                                <NavLink to="/chatbot" className={linkClass}>
                                    <i className="fa-solid fa-robot ms-2"></i>
                                    المساعد
                                </NavLink>
                            </li>

                        </ul>

                    </div>

                </div>

            </div>

        </header>
    );
}

export default DesktopNav;