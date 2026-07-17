import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Header from "./Header";

// كل صفحات المشروع كانت بتكرر نفس الـ nav والـ header يدوي في كل ملف html
// هنا بنلفهم مرة واحدة، و Outlet بيبقى مكان محتوى الصفحة الحالية (زي {children})

function Layout() {
  return (
    <>
      <Navbar />
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default Layout;
