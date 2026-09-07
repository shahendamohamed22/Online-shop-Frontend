import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import baseUrl from "../../services/Api";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import {
  validateRequired,
  validateEmail,
  validatePhone,
  validatePassword,
  validateConfirmPassword,
  validateSelect,
} from "../../services/validation";

function Register() {
  const navigate = useNavigate();
  const { refetchCart } = useCart();
  const { refetchWishlist } = useWishlist();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    preferredBranchId: "",
  });
  const [errors, setErrors] = useState({});

  const [branches, setBranches] = useState([]);
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/branch`);
        setBranches(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchBranches();
  }, []);

  function handleChange(e) {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });

    if (errors[e.target.name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[e.target.name];
        return updated;
      });
    }
  }

  function validate() {
    const newErrors = {
      firstName: validateRequired(user.firstName, "الاسم الأول"),
      lastName: validateRequired(user.lastName, "الاسم الأخير"),
      email: validateEmail(user.email),
      phoneNumber: validatePhone(user.phoneNumber),
      preferredBranchId: validateSelect(user.preferredBranchId, "الفرع"),
      password: validatePassword(user.password),
      confirmPassword: validateConfirmPassword(user.password, user.confirmPassword),
    };

    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key]) delete newErrors[key];
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) return;

    const { confirmPassword, ...registerData } = user;

    try {
      const response = await axios.post(
        `${baseUrl}/api/customer/auth/register`,
        registerData
      );

      localStorage.setItem("token", response.data.token);

      await refetchCart();
      await refetchWishlist();

      toast.success("تم إنشاء الحساب بنجاح");
      navigate("/");

    } catch (error) {
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);
      toast.error(error.response?.data?.message ?? "حدث خطأ أثناء إنشاء الحساب");
    }
  }

  const handleGoogleAuth = async (token) => {
    try {
      const res = await axios.post(`${baseUrl}/api/customer/auth/google`, {
        idToken: token,
      });

      console.log(res.data);
      if (res.data.requiresAdditionalInfo) {
        localStorage.setItem("googleEmail", res.data.email);
        localStorage.setItem("googleFirstName", res.data.firstName);
        localStorage.setItem("googleLastName", res.data.lastName);
        localStorage.setItem("googleIdToken", token);

        navigate("/CompleteGoogleProfile");
      } else {
        localStorage.setItem("token", res.data.token);

        await refetchCart();
        await refetchWishlist();

        navigate("/");
      }
    }
    catch (error) {
      console.log(error.response?.status);
      console.log(error.response?.data);
      toast.error(error.response?.data?.message ?? "حدث خطأ أثناء تسجيل الدخول ");
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-4">
      <div style={{ width: "100%", maxWidth: "600px" }} className="px-3">
        <form
          onSubmit={handleSubmit}
          className="shadow-lg rounded-4 p-4 bg-white"
        >
          <h2 className="text-center mb-4">Create Account</h2>

          <div className="row g-2 mb-3">
            <div className="col-6">
              <label className="form-label">First Name</label>
              <input
                type="text"
                className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
                name="firstName"
                value={user.firstName}
                onChange={handleChange}
              />
              {errors.firstName && <div className="text-danger small mt-1">{errors.firstName}</div>}
            </div>
            <div className="col-6">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
                name="lastName"
                value={user.lastName}
                onChange={handleChange}
              />
              {errors.lastName && <div className="text-danger small mt-1">{errors.lastName}</div>}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              name="email"
              value={user.email}
              onChange={handleChange}
            />
            {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
          </div>

          <div className="row g-2 mb-3">
            <div className="col-6">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                className={`form-control ${errors.phoneNumber ? "is-invalid" : ""}`}
                name="phoneNumber"
                value={user.phoneNumber}
                onChange={handleChange}
              />
              {errors.phoneNumber && <div className="text-danger small mt-1">{errors.phoneNumber}</div>}
            </div>
            <div className="col-6">
              <label className="form-label">Branch</label>
              <select
                className={`form-select ${errors.preferredBranchId ? "is-invalid" : ""}`}
                name="preferredBranchId"
                value={user.preferredBranchId}
                onChange={handleChange}
              >
                <option value="">Choose</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
              {errors.preferredBranchId && (
                <div className="text-danger small mt-1">{errors.preferredBranchId}</div>
              )}
            </div>
          </div>

          <div className="row g-2 mb-4">
            <div className="col-6">
              <label className="form-label">Password</label>
              <input
                type="password"
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                name="password"
                value={user.password}
                onChange={handleChange}
              />
              {errors.password && <div className="text-danger small mt-1">{errors.password}</div>}
            </div>
            <div className="col-6">
              <label className="form-label">Confirm password</label>
              <input
                type="password"
                className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                name="confirmPassword"
                value={user.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <div className="text-danger small mt-1">{errors.confirmPassword}</div>
              )}
            </div>
          </div>

          <button className="btn btn-main w-100 mb-3" type="submit">
            Create Account
          </button>

          <div className="d-flex align-items-center gap-2 my-3">
            <hr className="flex-grow-1" />
            <span className="text-muted small">OR</span>
            <hr className="flex-grow-1" />
          </div>

          <GoogleLogin
            onSuccess={(credentialResponse) => {
              handleGoogleAuth(credentialResponse.credential);
            }}
            onError={() => console.log("Google Login Failed")}
          />

          <p className="text-center mt-4 mb-0">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;