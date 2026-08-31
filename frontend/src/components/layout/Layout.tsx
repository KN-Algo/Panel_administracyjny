import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
  showNavbar?: boolean;
}

export default function Layout({ showNavbar = true }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen w-full bg-white">
      {showNavbar && <Navbar />}
      <main className="flex-1 w-full flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
