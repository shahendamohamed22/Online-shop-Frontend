import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";
import axiosInstance from "../services/axiosInstance";

// اتظبطت بالكامل على شكل رد /api/cart الحقيقي (items بأسامي productId/productName/
// unitPrice/finalPrice/quantity/subtotal/productImage) بدل الشكل المحلي القديم.
// وضفنا زرار "إتمام الطلب" اللي بيعمل POST /api/order فعليًا بمنتجات السلة.

function Cart() {
  const { cartItems, cartTotal, removeFromCart, updateQuantity, clearCart, loading } = useCart();
  const navigate = useNavigate();

  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState("");
  const [notes, setNotes] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await axiosInstance.get("/api/branch");
        setBranches(res.data ?? []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBranches();
  }, []);

  const handlePlaceOrder = async () => {
    if (!branchId) {
      toast.info("اختاري الفرع الأول");
      return;
    }

    setPlacingOrder(true);
    try {
      await axiosInstance.post("/api/order", {
        branchId: Number(branchId),
        notes,
        offerId: null,
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });
      toast.success("تم تسجيل طلبك بنجاح");
      await clearCart();
      navigate("/orders");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message ?? "حصل خطأ أثناء تسجيل الطلب");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return <p className="container mt-4">جاري التحميل...</p>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mt-4 text-center">
        <p>السلة فاضية.</p>
        <Link to="/shop" className="btn btn-main">تسوق الآن</Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="badge bg-main mb-3 fs-3">عربة التسوق</h2>

      {cartItems.map((item) => (
        <div key={item.productId} className="d-flex align-items-center gap-3 border-bottom pb-3 mb-3">
          <img
            src={item.productImage}
            alt={item.productName}
            style={{ width: "80px", height: "80px", objectFit: "cover" }}
          />
          <div className="flex-grow-1">
            <h5>{item.productName}</h5>
            <p className="mb-0">
              {item.finalPrice} جنيه
              {!item.isAvailable && <span className="text-danger small ms-2">(غير متوفر في فرعك المفضل)</span>}
            </p>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
            >
              -
            </button>
            <span>{item.quantity}</span>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
            >
              +
            </button>
          </div>

          <button className="btn btn-sm text-danger" onClick={() => removeFromCart(item.productId)}>
            <i className="fa-solid fa-trash"></i>
          </button>
        </div>
      ))}

      <div className="mt-4">
        <label className="form-label">اختاري الفرع</label>
        <select
          className="form-select mb-3"
          value={branchId}
          onChange={(e) => setBranchId(e.target.value)}
        >
          <option value="">اختاري فرع الاستلام/التوصيل</option>
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </select>

        <textarea
          className="form-control mb-3"
          placeholder="ملاحظات على الطلب (اختياري)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
        />
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <h4>الإجمالي: {cartTotal} جنيه</h4>
        <button className="btn btn-main" onClick={handlePlaceOrder} disabled={placingOrder}>
          {placingOrder ? "جاري التأكيد..." : "إتمام الطلب"}
        </button>
      </div>
    </div>
  );
}

export default Cart;
