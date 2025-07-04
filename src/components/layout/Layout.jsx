import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    // This structure ensures the footer is always at the bottom of the content flow.
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      {/* The main content area will grow to fill available space. */}
      <main className="flex flex-1">
        {/* The Outlet takes up the full width and height of the main area */}
        <div className="w-full flex">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}