import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import baseUrl from "../../services/Api";

function VerifyCode() {
    const navigate = useNavigate();

    const email = localStorage.getItem("email");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);

    function handleChange(e, index) {
        const value = e.target.value;

        // يسمح برقم واحد فقط
        if (!/^\d?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // ينقل للخانة اللي بعدها
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    }

    function handleKeyDown(e, index) {
        // يرجع للخانة اللي قبلها عند Backspace
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`).focus();
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const code = otp.join("");
        console.log({
            email,
            code,
        });

        try {
            const response = await axios.post(
                `${baseUrl}/api/auth/verify-code`,
                {
                    email,
                    code: code,
                }
            );

            console.log(response.data);
            localStorage.setItem("code", code)
            console.log(code);
            console.log(email);

            navigate("/ResetPassword");

        } catch (error) {
            console.log(error.response?.data);
        }
    }

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center ">
            <div style={{ width: "100%", maxWidth: "500px" }} className="px-3">
                <form
                    className="mx-auto shadow-lg rounded p-4" style={{ maxWidth: "500px" }}
                    onSubmit={handleSubmit}
                >
                    <h2 className="text-center mb-3">Verify OTP</h2>

                    <p className="text-center text-muted">
                        Enter the 6-digit code sent to your email.
                        <br />
                        <span className="fw-semibold text-dark">{email}</span>
                    </p>

                    <div className="d-flex justify-content-center gap-2 mb-4" dir="ltr">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                id={`otp-${index}`}
                                type="text"
                                className="form-control text-center"
                                style={{
                                    width: "55px",
                                    height: "55px",
                                    fontSize: "22px",
                                    fontWeight: "bold",
                                }}
                                value={digit}
                                maxLength={1}
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                            />
                        ))}
                    </div>

                    <button className="btn btn-success w-100">
                        Verify
                    </button>
                </form>
            </div>
        </div>
    );
}

export default VerifyCode;