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
  newPrice: 117,
  oldPrice: 130,
  discountPercentage: 10,
  hasDiscount: true,
  category: "meat",
  images: [{ url: susageHalwany }],
  onSale: true,
},
{
  id: 2,
  name: 'جبنة موزاريلا الحمد "٤٠٠ جرام"',
  newPrice: 66.5,
  oldPrice: 70,
  discountPercentage: 5,
  hasDiscount: true,
  category: "cheese",
  images: [{ url: elhamdMozzarella }],
  onSale: true,
},
{
  id: 3,
  name: 'ستربس اطياب حار "٤٠٠ جرام"',
  newPrice: 126,
  oldPrice: 140,
  discountPercentage: 10,
  hasDiscount: true,
  category: "chicken",
  images: [{ url: stripsAtyab }],
  onSale: true,
  // تفاصيل إضافية بتتعرض في صفحة تفاصيل المنتج بس
  fullName: "اطياب تشيكن ستربس حار 400 جرام",
  detailPrice: 1250,
  detailOldPrice: 1500,
},
{
  id: 4,
  name: 'برجر كوكي "١٠٠٠ جرام"',
  newPrice: 270,
  oldPrice: 300,
  discountPercentage: 10,
  hasDiscount: false,
  category: "meat",
  images: [{ url: burgreKoki }],
  onSale: false,
},
];

// المنتجات اللي بتظهر في قسم "الخصومات" بالصفحة الرئيسية
export const getSaleProducts = () => products.filter((p) => p.onSale);

// دالة تجيب منتج واحد بالـ id (تستخدم في صفحة تفاصيل المنتج)
export const getProductById = (id) =>
  products.find((p) => p.id === Number(id));
