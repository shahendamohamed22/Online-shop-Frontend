import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="container mt-4 text-center">
        <p>السلة فاضية.</p>
        <Link to="/shop" className="btn btn-main">تسوق الآن</Link>
      </div>
    );
  }
console.log( "caaaaaaaaart",cartItems);
  return (
    <div className="container mt-4">
      <h2 className="badge bg-main mb-3 fs-3">عربة التسوق</h2>

      {cartItems.map((item) => (
        <div key={item.id} className="d-flex align-items-center gap-3 border-bottom pb-3 mb-3">
          <img
            src={item.images?.[0]?.url}
            alt={item.name}
            style={{ width: "80px", height: "80px", objectFit: "cover" }}
          />
          <div className="flex-grow-1">
            <h5>{item.name}</h5>
            <p className="mb-0">{item.newPrice} جنيه</p>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
            >
              -
            </button>
            <span>{item.quantity}</span>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              +
            </button>
          </div>

          <button className="btn btn-sm text-danger" onClick={() => removeFromCart(item.id)}>
            <i className="fa-solid fa-trash"></i>
          </button>
        </div>
      ))}

      <div className="d-flex justify-content-between align-items-center mt-4">
        <h4>الإجمالي: {cartTotal} جنيه</h4>
        <button className="btn btn-main">إتمام الطلب</button>
      </div>
    </div>
  );
}

export default Cart;