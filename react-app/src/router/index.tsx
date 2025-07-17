import { createBrowserRouter } from "react-router-dom";
import Landing from "../pages/Landing";
import AboutPage from "../pages/AboutPage";
import AdminDashboard from "../dashboard/AdminDashboard"; // or use UserDashboard
import Error from "../components/Error/Error";

const router = createBrowserRouter([
  { path: "/", element: <Landing />, errorElement: <Error /> },
  { path: "/about", element: <AboutPage /> },
  { path: "/dashboard", element: <AdminDashboard /> }, // later we’ll use logic to switch this
]);

export default router;
