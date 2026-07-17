import { Routes, Route } from "react-router-dom";
import { WishlistProvider } from "./context/WishlistContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Wishlist from "./pages/Wishlist";
import Chatbot from "./pages/Chatbot";
import Login from "./pages/Login";
import Register from "./pages/signIn/Register";
import ForgetPassword from "./pages/signIn/ForgetPassword";
import ResetPassword from "./pages/signIn/ResetPassword";
import VerifyCode from "./pages/signIn/verifyCode";

function App() {
  return (
    // WishlistProvider بيلف كل الراوتات عشان أي صفحة تقدر توصل لحالة المفضلة
    <WishlistProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="chatbot" element={<Chatbot />} />
          <Route path="Login" element={<Login />} />
          <Route path="Register" element={<Register />} />
          <Route path="ForgetPassword" element={<ForgetPassword />} />
          <Route path="/ResetPassword" element={<ResetPassword />} />
          <Route path="/verifyCode" element={<VerifyCode />}> </Route> 
        </Route>
      </Routes>
    </WishlistProvider>
  );
}

export default App;
