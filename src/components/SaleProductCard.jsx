import { useWishlist } from "../context/WishlistContext";

// كارت أفقي مستخدم في قسم "الخصومات" بالصفحة الرئيسية فقط (تصميم مختلف عن كارت المتجر)

function SaleProductCard({ product }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  return (
    <div className="col-12">
      <div className="card-produt border rounded-3 shadow">
        <div className="row">
          <div className="col-3 align-items-center">
            <img src={product.image} alt={product.name} />
          </div>
          <div className="col-7 me-auto">
            <div className="d-flex flex-column w-100">
              <div className="sale-icons d-flex align-items-center justify-content-between w-100 p-2">
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
              <div className="p-3">
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
        </div>
      </div>
    </div>
  );
}

export default SaleProductCard;
