import { useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../provider/userProvider";
import { MAIN_SERVER_ROUTE } from "../constants";

const Main = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user && location.pathname != "/auth") navigate("/auth");
  }, [user, location]);

  const handleLogout = () => {
    fetch(`${MAIN_SERVER_ROUTE}/auth/logout`, { method: "GET" })
      .then((response) => {
        if (response.ok) {
          navigate("/auth"); // Redirect to the auth page after logout
        } else {
        }
      })
      .catch((error) => {
        console.error("Error during logout:", error);
      });
  };

  return (
    <>
      {user && (
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white hover:bg-red-600 transition-colors font-semibold inline-flex items-center gap-2 border px-4 p-2 rounded-md shadow-sm"
            >
              Logout
            </button>
          </li>
        </ul>
      )}
      <Outlet />
    </>
  );
};

export default Main;
