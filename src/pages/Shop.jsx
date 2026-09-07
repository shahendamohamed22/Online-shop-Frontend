import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";

function Shop() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get(`/api/category`);
        setCategories(response.data ?? []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, []);

  const mainCategories = categories.filter((cat) => cat.parentCategoryId === null);

  return (
    <div className="container mt-4">
      <h2 className="badge bg-main mt-2 fs-3">المتجر</h2>
      <div className="row g-3 mt-4">
        {mainCategories.map((cat) => (
          <Link
            key={cat.id}
            to={`/SubCategories/${cat.id}`}
            className="col-12 col-md-6 text-decoration-none text-black"
          >
            <div className="border rounded-4 overflow-hidden shadow text-center">
              <img
                src={cat.imageUrl}
                alt={cat.name}
                style={{ height: "200px", objectFit: "cover", width: "100%" }}
              />
              <p className="p-2 mb-0 fw-bold">{cat.name}</p>
              <p className="text-muted small pb-2">{cat.productsCount} منتج</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Shop;