import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../provider/userProvider";
import { MAIN_SERVER_ROUTE } from "../constants";
import { IoChevronBack } from "react-icons/io5";
import DropDown from "../components/DropDown/DropDown";

const Main = () => {
  const { user, logoutUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");
    if (token) {
      localStorage.setItem("authToken", token);
      navigate(location.pathname, { replace: true });
    }
    // if (location.pathname != "/auth") navigate("/auth");
  }, [user, location, navigate]);

  const handleLogout = () => {
    fetch(`${MAIN_SERVER_ROUTE}/auth/logout`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          logoutUser();
          navigate("/auth"); // Redirect to the auth page after logout
        } else {
        }
      })
      .catch((error) => {
        console.error("Error during logout:", error);
      });
  };

  const userImage = user?.profileImage || "vite.svg";

  function handleBackButton() {
    navigate(-1);
  }

  function getHeadingPathname() {
    const pathname = location.pathname;
    if (pathname.startsWith("/chat")) return "Chat";
    if (pathname === "/") return "Repositories";
    return "Git Gossips";
  }
  const heading = getHeadingPathname();
  return (
    <>
      {user && (
        <ul className="inline-flex items-center gap-2 px-4 p-2 justify-between w-full">
          <div className="inline-flex items-center gap-2">
            {location.pathname !== "/" && (
              <li>
                <button onClick={handleBackButton} className="p-2 block">
                  <IoChevronBack className="text-lg" />
                </button>
              </li>
            )}

            <h4 className="text-lg font-semibold">{heading}</h4>
          </div>
          <div className="profile">
            <DropDown
              target={
                <img
                  className="w-10 h-10 rounded-full object-center object-cover"
                  width={40}
                  height={40}
                  src={userImage}
                  alt=""
                />
              }
            >
              <button
                onClick={handleLogout}
                className="text-white font-semibold px-4 p-2 w-full"
              >
                Logout
              </button>
            </DropDown>
          </div>
        </ul>
      )}
      <div className="p-4">
        <Outlet />
      </div>
    </>
  );
};

export default Main;
