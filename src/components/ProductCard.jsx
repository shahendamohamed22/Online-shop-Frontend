import { Link , useNavigate} from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";


function ProductCard({ product }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);
  
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // بناخد أول صورة من مصفوفة الصور - لو مفيش صور خالص نحط undefined بدل ما نكسر
  const productImage = product.images?.[0]?.url;

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="col-6 col-md-4 col-lg-3 product">
      <div className="border rounded-4 overflow-hidden shadow position-relative h-100">
        <div className="item d-flex align-items-center justify-content-between w-100 position-absolute p-2">
            <i
              className={`heart fa-solid fa-heart fs-3 ${
                inWishlist ? "main-color" : "color-gray"
              }`}
              onClick={() => toggleWishlist(product.id)}
            ></i>
          {/* الشارة بتظهر بس لو hasDiscount = true */}
          {product.hasDiscount && (
            <h3 className="badge bg-main fs-6">{product.discountPercentage}%</h3>
          )}
        </div>

        <Link to={`/product/${product.id}`}>
          <img src={productImage} alt={product.name} className="w-100" />
        </Link>

        <div className="p-3 border-top border-2">
          <h3 className="fs-5">{product.name}</h3>
          <div className="mt-2 d-flex justify-content-between">
            <h4 className="fs-6">{product.newPrice} جنيه</h4>
            {/* السعر القديم بيظهر بس لو فيه خصم فعلي */}
            {product.hasDiscount && (
              <s className="text-danger">{product.oldPrice} جنية</s>
            )}
          </div>
          <button className="btn btn-main w-100 mt-2" onClick={handleAddToCart}>
            <i className="fa-solid fa-cart-shopping"></i> اضف الى السلة
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;