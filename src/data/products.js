// مصدر البيانات الوحيد (Single Source of Truth) لكل المنتجات في التطبيق
// أي صفحة (الرئيسية / المتجر / تفاصيل المنتج / المفضلة) بتقرا من هنا وبتفلتر/بترندر منه
// بدل ما البيانات تتكرر في كل صفحة زي ما كانت في الـ HTML الأصلي

import susageHalwany from "../assets/imgs/susage-halwany.avif";
import elhamdMozzarella from "../assets/imgs/elhamd-mozzarella.jpeg";
import stripsAtyab from "../assets/imgs/strips-atyab.avif";
import burgreKoki from "../assets/imgs/burgre-koki.avif";

export const products = [
  {
    id: 1,
    name: 'سجق حلواني اخوات "٤٠٠ جرام"',
    price: 117,
    oldPrice: 130,
    discount: 10,
    category: "meat",
    image: susageHalwany,
    onSale: true,
  },
  {
    id: 2,
    name: 'جبنة موزاريلا الحمد "٤٠٠ جرام"',
    price: 66.5,
    oldPrice: 70,
    discount: 5,
    category: "cheese",
    image: elhamdMozzarella,
    onSale: true,
  },
  {
    id: 3,
    name: 'ستربس اطياب حار "٤٠٠ جرام"',
    price: 126,
    oldPrice: 140,
    discount: 10,
    category: "chicken",
    image: stripsAtyab,
    onSale: true,
    // تفاصيل إضافية بتتعرض في صفحة تفاصيل المنتج بس
    fullName: "اطياب تشيكن ستربس حار 400 جرام",
    detailPrice: 1250,
    detailOldPrice: 1500,
  },
  {
    id: 4,
    name: 'برجر كوكي "١٠٠٠ جرام"',
    price: 270,
    oldPrice: 300,
    discount: 10,
    category: "meat",
    image: burgreKoki,
    onSale: false,
  },
];

// المنتجات اللي بتظهر في قسم "الخصومات" بالصفحة الرئيسية
export const getSaleProducts = () => products.filter((p) => p.onSale);

// دالة تجيب منتج واحد بالـ id (تستخدم في صفحة تفاصيل المنتج)
export const getProductById = (id) =>
  products.find((p) => p.id === Number(id));
