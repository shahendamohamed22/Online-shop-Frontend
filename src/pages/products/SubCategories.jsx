import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import baseUrl from "../../services/Api";

function SubCategories() {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/category/${categoryId}`);
        setCategory(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategory();
  }, [categoryId]);

  const subCategories = category?.subCategories ?? [];

  return (
    <div className="container mt-4">
      <h2 className="badge bg-main fs-3">{category?.name}</h2>
      <div className="row g-3 mt-4">
        {subCategories.map((sub) => {
          // لو القسم ده لسه جواه أقسام فرعية تانية، نكمل ندخل مستوى تاني من الأقسام
          // لو مفيهوش (يعني قسم نهائي)، نروح مباشرة لصفحة المنتجات بتاعته
          const hasChildren = (sub.subCategories?.length ?? 0) > 0;
          const targetPath = hasChildren ? `/SubCategories/${sub.id}` : `/Products/${sub.id}`;

          return (
            <Link
              key={sub.id}
              to={targetPath}
              className="col-12 col-md-6 text-decoration-none text-black"
            >
              <div className="border rounded-4 overflow-hidden shadow text-center">
                <img
                  src={sub.imageUrl}
                  alt={sub.name}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <p className="p-2 mb-0 fw-bold">{sub.name}</p>
                <p className="text-muted small pb-2">{sub.productsCount} منتج</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default SubCategories;