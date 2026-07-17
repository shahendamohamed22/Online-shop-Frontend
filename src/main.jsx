import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// ترتيب الاستيراد مهم: bootstrap الأول عشان style.css بتاعنا يقدر يعمل override عليه
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // بيفعّل الكاروسيل وأي data-bs-* components
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./assets/css/style.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import googleClientId from "./services/googleCongif.js";

import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>
);
