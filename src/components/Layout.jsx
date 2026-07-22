import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Header from "./Header";
import DesktopNav from "./DesktopNavbar";
import { ToastContainer } from "react-toastify";

// كل صفحات المشروع كانت بتكرر نفس الـ nav والـ header يدوي في كل ملف html
// هنا بنلفهم مرة واحدة، و Outlet بيبقى مكان محتوى الصفحة الحالية (زي {children})

function Layout() {
  return (
    <>
      <DesktopNav />
      <Navbar />
      <Header />
      <main>
        <Outlet />
      </main>
      <ToastContainer
        position="bottom-left"
        rtl={true}
        autoClose={2000}
      />
    </>
  );
}

export default Layout;
