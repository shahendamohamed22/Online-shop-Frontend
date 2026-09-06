import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Header from "./Header";
import DesktopNav from "./DesktopNavbar";

// كل صفحات المشروع كانت بتكرر نفس الـ nav والـ header يدوي في كل ملف html
// هنا بنلفهم مرة واحدة، و Outlet بيبقى مكان محتوى الصفحة الحالية (زي {children})
// ملحوظة: ToastContainer اتنقلت لـ main.jsx بدل ما تكون هنا، عشان صفحات زي
// Login/Register (اللي برا الـ Layout ده تمامًا) تقدر تعرض toast برضو

function Layout() {
  return (
    <>
      <DesktopNav />
      <Navbar />
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default Layout;
