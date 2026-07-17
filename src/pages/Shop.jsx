import { useState , useEffect } from "react";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";
import axios from "axios";
import baseUrl from "../services/Api";

// في main.js الأصلي الفلترة كانت بتضيف/تشيل class="hidden" على كل item يدوي
// هنا بدل كده عندنا state واحدة (selectedCategory) وبنعمل filter على الـ array
// وبنرندر بس اللي طابق - React بيتكفل بتحديث الشاشة تلقائي

function Shop() {
  const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedSubCategory, setSelectedSubCategory] = useState("all");
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

   const handleCategoryClick = (id) => {
    setSelectedCategory(id);
    setSelectedSubCategory("all"); // نصفّر الفرعي كل ما نغيّر الرئيسي
  };

  const activeCategory = categories.find((c) => c.id === selectedCategory);
  const currentSubcategories = activeCategory?.subCategories ?? [];

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
     <>
      {/* التابات الرئيسية */}
      <div className="d-flex gap-2 justify-content-center mt-4 flex-wrap">
        <button
          className={`btn ${
            selectedCategory === "all" ? "btn-main" : "btn-outline-secondary"
          }`}
          onClick={() => handleCategoryClick("all")}
        >
          الكل
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`btn ${
              selectedCategory === cat.id ? "btn-main" : "btn-outline-secondary"
            }`}
            onClick={() => handleCategoryClick(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

         {/* التابات الفرعية - بتظهر بس لو الفئة المختارة عندها subCategories */}
      {currentSubcategories.length > 0 && (
        <div className="d-flex gap-2 justify-content-center mt-2 flex-wrap">
          <button
            className={`btn btn-sm ${
              selectedSubCategory === "all" ? "btn-main" : "btn-outline-secondary"
            }`}
            onClick={() => setSelectedSubCategory("all")}
          >
            الكل
          </button>
          {currentSubcategories.map((sub) => (
            <button
              key={sub.id}
              className={`btn btn-sm ${
                selectedSubCategory === sub.id ? "btn-main" : "btn-outline-secondary"
              }`}
              onClick={() => setSelectedSubCategory(sub.id)}
            >
              {sub.name}
            </button>
          ))}
        </div>
      )}

      <div className="container mt-4">
        <div className="row g-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Shop;
