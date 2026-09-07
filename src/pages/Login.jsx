import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import baseUrl from "../services/Api";
import { validateEmail, validateRequired } from "../services/validation";
import { toast } from "react-toastify";


function Login() {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});

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
            email: validateEmail(user.email),
            password: validateRequired(user.password, "كلمة السر"),
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

        try {
            const response = await axios.post(
                `${baseUrl}/api/customer/auth/login`,
                user
            );
            console.log("Login Success");

            localStorage.setItem("token", response.data.token);
            toast.success("تم تسجيل الدخول بنجاح");
            navigate("/");

        } catch (error) {
            console.log("STATUS:", error.response?.status);
            console.log("DATA:", error.response?.data);
            toast.error(error.response?.data?.message ?? "الإيميل أو كلمة السر غير صحيحة");

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

                navigate("/");
            }
        }
        catch (error) {
            console.log(error.response?.status);
            console.log(error.response?.data);
        }
    }
    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center ">
            <div style={{ width: "100%", maxWidth: "500px" }} className="px-3">
                <form className="mx-auto shadow-lg p-4 rounded" style={{ maxWidth: "500px" }}
                    onSubmit={handleSubmit} >
                    <h2 className="text-center mb-4">
                        Welcome Back
                    </h2>

                    <div className="mb-3">
                        <label>Email</label>
                        <input
                            type="email"
                            className={`form-control ${errors.email ? "is-invalid" : ""}`}
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                        />
                        {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
                    </div>

                    <div className="mb-3">
                        <label>Password</label>
                        <input
                            type="password"
                            className={`form-control ${errors.password ? "is-invalid" : ""}`}
                            name="password"
                            value={user.password}
                            onChange={handleChange}
                        />
                        {errors.password && <div className="text-danger small mt-1">{errors.password}</div>}
                    </div>

                    <div className="text-end mb-3">
                        <Link to="/ForgetPassword" type="button" className="btn btn-link p-0" >
                            ? Forgot Password
                        </Link>
                    </div>

                    <button className="btn btn-success w-100" type="submit">
                        Login
                    </button>

                    <div className="text-center my-4">
                        OR
                    </div>

                    <GoogleLogin
                        onSuccess={(credentialResponse) => {
                            handleGoogleAuth(credentialResponse.credential);
                            console.log("success Login Failed")
                        }}
                        onError={() => console.log("Google Login Failed")}
                    />

                    <p className="text-center mt-4">
                        <Link to="/Register" type="button" className="btn btn-link">
                            Sign Up
                        </Link>
                        ? Don't have an account
                    </p>
                </form>
            </div>
        </div>
    );

}

export default Login;