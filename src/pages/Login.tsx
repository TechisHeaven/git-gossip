import { BiChevronRight } from "react-icons/bi";
import { MAIN_GITHUB_LOGIN_URL } from "../constants";

const Login = () => {
  // function handleLogin() {
  //   window.location.href = MAIN_GITHUB_LOGIN_URL;
  //   // navigate(MAIN_GITHUB_LOGIN_URL);
  // }

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center py-8 gap-4">
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="title-small border px-4 p-2 rounded-full text-xs shadow-md shadow-white/20 select-none ">
          Github Gossips
        </div>
        <h1 className="text-7xl sm:text-9xl md:text-[10rem] font-bold text-center whitespace-nowrap select-none">
          Git Gossips
        </h1>
      </div>
      <img
        src="/globe.webp"
        alt=""
        draggable="false"
        className="w-full max-w-[800px] absolute -z-10"
      />
      <a
        href={MAIN_GITHUB_LOGIN_URL}
        className="bg-white text-black hover:bg-white/80 transition-colors hover:shadow-md shadow-mainBackgroundColor font-semibold inline-flex items-center gap-2 border px-4 p-2 rounded-md shadow-sm "
      >
        Get Started with Git Gossips <BiChevronRight className="text-xl" />
      </a>
    </div>
  );
};

export default Login;
