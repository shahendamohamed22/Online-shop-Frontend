import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import baseUrl from "../../services/Api";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

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
    preferredBranchId: "",
  });

  const [branches, setBranches] = useState([]);
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/branch`);
        setBranches(response.data);
        console.log(response.data)
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
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (user.password !== user.confirmPassword) {
      toast.error("كلمة السر وتأكيدها مش متطابقين");
      return;
    }

    const { confirmPassword, ...registerData } = user;

    try {
      const response = await axios.post(
        `${baseUrl}/api/customer/auth/register`,
        registerData
      );

      console.log(response.data);
      // كانت الخطوة دي ناقصة - الباك اند بيرجع token فعلي بعد التسجيل مباشرة،
      // لكن الكود القديم كان بيتجاهله وميحطوش في localStorage، يعني المستخدم
      // كان بيتحول للرئيسية "من غير" ما يبقى فعليًا مسجل دخول
      localStorage.setItem("token", response.data.token);

      await refetchCart();
      await refetchWishlist();

      navigate("/");

    } catch (error) {
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);
      toast.error(error.response?.data?.message ?? "حصل خطأ أثناء إنشاء الحساب");
    }
  }

  const handleGoogleAuth = async (token) => {
    try {
      const res = await axios.post(`${baseUrl}/api/customer/auth/google`, {
        idToken: token,
      });

      // لو نجح على طول (يعني مستخدم قديم) - سجّليه دخول عادي هنا
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
      toast.error(error.response?.data?.message ?? "حصل خطأ أثناء تسجيل الدخول بجوجل");
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
            className="form-control"
            name="firstName"
            value={user.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-6">
          <label className="form-label">Last Name</label>
          <input
            type="text"
            className="form-control"
            name="lastName"
            value={user.lastName}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Email</label>
        <input
          type="email"
          className="form-control"
          name="email"
          value={user.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="row g-2 mb-3">
        <div className="col-6">
          <label className="form-label">Phone</label>
          <input
            type="tel"
            className="form-control"
            name="phoneNumber"
            value={user.phoneNumber}
            onChange={handleChange}
          />
        </div>
        <div className="col-6">
          <label className="form-label">Branch</label>
          <select
            className="form-select"
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
        </div>
      </div>

      <div className="row g-2 mb-4">
        <div className="col-6">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={user.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-6">
          <label className="form-label">Confirm password</label>
          <input
            type="password"
            className="form-control"
            name="confirmPassword"
            value={user.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <button className="btn btn-main w-100 mb-3" type="submit">
        Create Account
      </button>

      {/* فاصل "OR" بخطوط بدل نص لوحده */}
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