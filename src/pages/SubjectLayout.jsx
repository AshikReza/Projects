import { useState, useEffect } from "react";
import { Outlet, useParams, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react"; // <-- Import motion tools
import useSubjectManifest from "../hooks/useSubjectManifest";
import Sidebar from "../components/layout/Sidebar";
import { PanelLeft, PanelLeftClose } from "lucide-react";

// Define a more subtle animation for the content area
const contentVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const contentTransition = {
  type: "spring",
  stiffness: 200,
  damping: 25,
};

export default function SubjectLayout() {
  const { subjectId } = useParams();
  const location = useLocation(); // <-- Get location for the key
  const { manifest, loading, error } = useSubjectManifest(subjectId);

  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const closeMobileSidebar = () => {
    if (window.innerWidth < 768) {
      setIsMobileOpen(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) return <div className="p-10 text-center w-full">Loading...</div>;
  if (error)
    return (
      <div className="p-10 text-center text-red-500 w-full">
        Subject not found.
      </div>
    );

  return (
    <div className="grid w-full md:grid-cols-[auto_1fr] transition-[grid-template-columns] duration-300 ease-in-out">
      {/* --- Column 1: The Sidebar (No changes here) --- */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 flex flex-col border-r-2 border-r-gray-300 bg-gray-50 transition-all duration-300 ease-in-out
          md:static md:z-auto md:translate-x-0
          ${isDesktopCollapsed ? "md:w-16" : "md:w-72"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="hidden h-[57px] items-center justify-center border-b-2 border-b-gray-300 md:flex">
          <button
            onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100"
            title="Toggle Sidebar"
          >
            <PanelLeftClose
              className={`h-6 w-6 transition-transform duration-300 ${
                isDesktopCollapsed ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
        <Sidebar
          isCollapsed={isDesktopCollapsed}
          manifest={manifest}
          onLinkClick={closeMobileSidebar}
        />
      </aside>

      {/* --- Column 2: The Main Content Area --- */}
      <div className="flex flex-col bg-white overflow-hidden">
        <header className="sticky top-0 z-10 flex h-[57px] bg-gray-50 border-b-2 border-b-gray-300 items-center gap-1 px-4 shrink-0">
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 rounded-md hover:bg-gray-100 md:hidden"
            title="Open Menu"
          >
            <PanelLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold">{manifest.subjectName}</h1>
        </header>

        {isMobileOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/40 md:hidden"
            onClick={() => setIsMobileOpen(false)}
          ></div>
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* --- THIS IS THE KEY CHANGE --- */}
          {/* This AnimatePresence wraps ONLY the changing content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname} // Use the full path here for content changes
              variants={contentVariants}
              initial="initial"
              animate="in"
              exit="out"
              transition={contentTransition}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
