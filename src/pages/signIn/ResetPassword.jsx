import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import baseUrl from "../../services/Api";
import {validatePassword,  validateConfirmPassword,} from "../../services/validation";
import { toast } from "react-toastify";

function ResetPassword() {
  const navigate = useNavigate();

  const email = localStorage.getItem("email");
  const code = localStorage.getItem("code");

  const [user, setUser] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;

    setUser({
      ...user,
      [name]: value,
    });

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

    const passwordError = validatePassword(user.password);
    const confirmPasswordError = validateConfirmPassword(
      user.password,
      user.confirmPassword
    );

    if (passwordError) {
      newErrors.password = passwordError;
    }

    if (confirmPasswordError) {
      newErrors.confirmPassword = confirmPasswordError;
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
        `${baseUrl}/api/auth/complete-reset-password?code=${code}`,
        {
          email,
          newPassword: user.password,
        }
      );

      console.log(response.data);

      localStorage.removeItem("email");
      localStorage.removeItem("code");
      toast.success("تم تحديث كلمة السر");
      navigate("/login");
    } catch (error) {
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);

      const backendErrors = error.response?.data?.errors;

      if (backendErrors) {
        const formattedErrors = {};

        // NewPassword -> password
        if (backendErrors.NewPassword) {
          formattedErrors.password =
            backendErrors.NewPassword[0];
        }

        // لو الباك رجّع error عام
        if (backendErrors.message) {
          formattedErrors.password =
            backendErrors.message[0];
        }

        setErrors(formattedErrors);
      } else if (error.response?.data?.message) {
        setErrors({
          password: error.response.data.message,
        });
      } else {
        setErrors({
          password: "حدث خطأ أثناء تغيير كلمة السر",
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
          <h2 className="text-center mb-4">
            Reset Password
          </h2>

          {/* New Password */}
          <div className="mb-3">
            <label className="form-label">
              New Password
            </label>

            <input
              type="password"
              className={`form-control ${errors.password ? "is-invalid" : ""
                }`}
              name="password"
              value={user.password}
              onChange={handleChange}
            />

            {errors.password && (
              <div className="text-danger small mt-1">
                {errors.password}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="form-label">
              Confirm Password
            </label>

            <input
              type="password"
              className={`form-control ${errors.confirmPassword ? "is-invalid" : ""
                }`}
              name="confirmPassword"
              value={user.confirmPassword}
              onChange={handleChange}
            />

            {errors.confirmPassword && (
              <div className="text-danger small mt-1">
                {errors.confirmPassword}
              </div>
            )}
          </div>

          <button
            className="btn btn-main w-100"
            type="submit"
          >
            Reset Password
          </button>

          <p className="text-center mt-4 mb-0">
            Back to{" "}
            <Link to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;