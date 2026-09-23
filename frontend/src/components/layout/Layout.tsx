import { useState, type CSSProperties } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
  showNavbar?: boolean;
}

export default function Layout({ showNavbar = true }: LayoutProps) {
  const [navbarHeight, setNavbarHeight] = useState(64);

  return (
    <div
      className="flex min-h-screen w-full flex-col bg-white"
      style={{ "--public-navbar-height": `${navbarHeight}px` } as CSSProperties}
    >
      {showNavbar && <Navbar onHeightChange={setNavbarHeight} />}
      <main className="flex-1 w-full flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
