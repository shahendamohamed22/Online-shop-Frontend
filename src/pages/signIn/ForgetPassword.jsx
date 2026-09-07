import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import baseUrl from "../../services/Api";
import { validateEmail } from "../../services/validation";

function ForgotPassword() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
  });

  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;

    setUser({
      ...user,
      [name]: value,
    });

    // إزالة الخطأ بمجرد ما المستخدم يبدأ يعدل
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  }

  function validate() {
    const newErrors = {};

    const emailError = validateEmail(user.email);

    if (emailError) {
      newErrors.email = emailError;
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Frontend validation
    if (!validate()) return;

    try {
      const response = await axios.post(
        `${baseUrl}/api/auth/forgot-password`,
        user
      );

      console.log(response.data);

      localStorage.setItem("email", user.email);

      navigate("/verifyCode");
    } catch (error) {
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);

      const backendErrors = error.response?.data?.errors;

      if (backendErrors?.Email) {
        setErrors({
          email: backendErrors.Email[0],
        });
      } else if (error.response?.data?.message) {
        setErrors({
          email: error.response.data.message,
        });
      } else {
        setErrors({
          email: "حدث خطأ أثناء إرسال طلب استعادة كلمة السر",
        });
      }
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div
        style={{ width: "100%", maxWidth: "500px" }}
        className="px-3"
      >
        <form
          onSubmit={handleSubmit}
          className="shadow-lg rounded p-4 mx-auto"
          style={{ maxWidth: "500px" }}
        >
          <h2 className="text-center mb-3">
            Forgot Password
          </h2>

          <p className="text-center text-muted mb-4">
            Enter your email and we'll send you a password reset link.
          </p>

          <div className="mb-4">
            <label className="form-label">
              Email
            </label>

            <input
              type="email"
              className={`form-control ${
                errors.email ? "is-invalid" : ""
              }`}
              placeholder="Enter your email"
              name="email"
              value={user.email}
              onChange={handleChange}
            />

            {errors.email && (
              <div className="text-danger small mt-1">
                {errors.email}
              </div>
            )}
          </div>

          <button
            className="btn btn-main w-100"
            type="submit"
          >
            Send Reset Link
          </button>

          <p className="text-center mt-4 mb-0">
            Remember your password?{" "}
            <Link to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
