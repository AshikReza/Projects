import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Layout from "./components/layout/Layout";
import SubjectLayout from "./pages/SubjectLayout";
import ContentPage from "./pages/ContentPage";
import SubjectWelcomePage from "./pages/SubjectWelcomePage"; // A new welcome page

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "subjects/:subjectId",
        element: <SubjectLayout />,
        children: [
          // When no topic is selected, show a welcome message
          { index: true, element: <SubjectWelcomePage /> },
          // When a topic IS selected, render the content page
          { path: ":chapterId/:contentId", element: <ContentPage /> }
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;