import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import SubCategories from "./pages/products/SubCategories";
import Products from "./pages/products/Products";
import ProductDetails from "./pages/products/ProductDetails";
import Wishlist from "./pages/Wishlist";
import Chatbot from "./pages/Chatbot";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Orders from "./pages/orders/Orders";
import OrderDetails from "./pages/orders/OrderDetails";
import Login from "./pages/Login";
import Register from "./pages/signIn/Register";
import ForgetPassword from "./pages/signIn/ForgetPassword";
import ResetPassword from "./pages/signIn/ResetPassword";
import VerifyCode from "./pages/signIn/verifyCode";
import CompleteGoogleProfile from "./pages/signIn/CompleteGoogleProfile";
import OfferCheckout from "./pages/OfferCheckout";

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="shop" element={<Shop />} />
              <Route path="product/:id" element={<ProductDetails />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="chatbot" element={<Chatbot />} />
              <Route path="Cart" element={<Cart />} />
              <Route path="profile" element={<Profile />} />
              <Route path="orders" element={<Orders />} />
              <Route path="orders/:id" element={<OrderDetails />} />
              <Route path="/SubCategories/:categoryId" element={<SubCategories />} />
              <Route path="/Products/:categoryId" element={<Products />} />
              <Route path="offer/:offerId/checkout" element={<OfferCheckout />} />
            </Route>
            <Route path="Login" element={<Login />} />
            <Route path="Register" element={<Register />} />
            <Route path="ForgetPassword" element={<ForgetPassword />} />
            <Route path="/ResetPassword" element={<ResetPassword />} />
            <Route path="/verifyCode" element={<VerifyCode />} />
            <Route path="/CompleteGoogleProfile" element={<CompleteGoogleProfile />} />
          </Routes>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;
