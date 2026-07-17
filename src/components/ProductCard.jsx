import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";

// كارت المنتج المستخدم في صفحة المتجر وصفحة المفضلة (تصميم شبكي/grid)
// بياخد المنتج كـ prop ويترندر منه - نفس الكارت المتكرر بقى مصدره array واحد

function ProductCard({ product }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  return (
    <div className="col-6 product" data-category={product.category}>
      <div className="border rounded-4 overflow-hidden shadow position-relative h-100">
        <div className="item d-flex align-items-center justify-content-between w-100 position-absolute p-2">
          <h3 className="badge bg-main fs-6">{product.discount}%</h3>
          <div>
            <i
              className={`heart fa-solid fa-heart fs-3 ${
                inWishlist ? "main-color" : "color-gray"
              }`}
              onClick={() => toggleWishlist(product.id)}
            ></i>
          </div>
        </div>

        <Link to={`/product/${product.id}`}>
          <img src={product.image} alt={product.name} className="w-100" />
        </Link>

        <div className="p-3 border-top border-2">
          <h3 className="fs-5">{product.name}</h3>
          <div className="mt-2 d-flex justify-content-between">
            <h4 className="fs-6">{product.price} جنيه</h4>
            <s className="text-danger">{product.oldPrice} جنية</s>
          </div>
          <button className="btn btn-main w-100 mt-2">
            <i className="fa-solid fa-cart-shopping"></i> اضف الى السلة
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
