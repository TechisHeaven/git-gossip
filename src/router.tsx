import { createBrowserRouter } from "react-router-dom";
import Main from "./layout/main.layout";
import ErrorPage from "./pages/Error";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <div>Dashboard Page</div>,
      },
    ],
  },
  {
    path: "about",
    element: <div>About</div>,
  },
]);
