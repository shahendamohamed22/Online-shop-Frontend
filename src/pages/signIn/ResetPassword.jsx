import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import baseUrl from "../../services/Api";

function ResetPassword() {
  const navigate = useNavigate();
  const email = localStorage.getItem("email");
  const code = localStorage.getItem("code");

  const [user, setUser] = useState({
    password: "",
    confirmPassword: "",
  });

  function handleChange(e) {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (user.password !== user.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post(
        `${baseUrl}/api/auth/complete-reset-password?code=${code}`,
        {
          email,
          newPassword: user.password,
        }
      );

      console.log(user)
      
      console.log("Hello");
      console.log(response.data);
      
      console.log("Helloooooooooooo");
      localStorage.removeItem("email");
      localStorage.removeItem("code");

      alert("Password changed successfully");
      navigate("/login");
    } catch (error) {
      console.log(error.response?.status);
      console.log(error.response?.data);
    }

    console.log(user);

    // هنبعت للباك بعدين

  }

  return (
    <div className="container py-5">
      <form
        onSubmit={handleSubmit}
        className="shadow rounded p-4 mx-auto"
        style={{ maxWidth: "500px" }}
      >
        <h2 className="text-center mb-4">
          Reset Password
        </h2>

        <div className="mb-3">
          <label className="form-label">
            New Password
          </label>

          <input
            type="password"
            className="form-control"
            name="password"
            value={user.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="form-label">
            Confirm Password
          </label>

          <input
            type="password"
            className="form-control"
            name="confirmPassword"
            value={user.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button
          className="btn btn-main w-100"
          type="submit"
        >
          Reset Password
        </button>

        <p className="text-center mt-4">
          Back to{" "}
          <Link to="/login">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default ResetPassword;