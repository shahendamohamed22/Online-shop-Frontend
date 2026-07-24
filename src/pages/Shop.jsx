import { useState, useEffect , } from "react";
import { Link } from "react-router-dom";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";
import axios from "axios";
import baseUrl from "../services/Api";

// في main.js الأصلي الفلترة كانت بتضيف/تشيل class="hidden" على كل item يدوي
// هنا بدل كده عندنا state واحدة (selectedCategory) وبنعمل filter على الـ array
// وبنرندر بس اللي طابق - React بيتكفل بتحديث الشاشة تلقائي

function Shop() {

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/category`);
        setCategories(response.data);
        console.log(response)
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategories();
  }, []);


  const mainCategories = categories.filter((cat) => cat.parentCategoryId === null);
  return (
    <>

      <div className="container mt-4">
        <div className="row g-3">
          {mainCategories.map((cat) => (
            <Link
              key={cat.id}
              to={`/SubCategories/${cat.id}`}
              className="col-6 col-md-4 col-lg-3 text-decoration-none text-black"
            >
              <div className="border rounded-4 overflow-hidden shadow text-center">
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  style={{ height: "150px", objectFit: "cover" }}
                />
                <p className="p-2 mb-0 fw-bold">{cat.name}</p>
                <p className="text-muted small pb-2">{cat.productsCount} منتج</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </>
  );
}

export default Shop;
