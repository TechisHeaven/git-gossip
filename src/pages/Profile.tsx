import { Link } from "react-router-dom";
import { useAuth } from "../provider/userProvider";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="p-4 flex flex-col items-start gap-2 max-w-80 w-full">
      <img
        src={user?.profileImage}
        alt="profile-image"
        width={100}
        height={100}
        className="w-20 h-20 object-cover rounded-full border shadow-md"
      />
      <h6 className="font-semibold text-xl">{user?.name}</h6>
      <p className="text-gray-400">{user?.username}</p>
      <div className="flex flex-row gap-2 w-full">
        <a
          target="__blank"
          href={user?.profileUrl}
          className="px-4 p-2 border font-semibold  border-white text-white rounded-lg shadow-md"
        >
          Github
        </a>
        <Link
          to="/chat"
          className="px-4 p-2 border font-semibold bg-white hover:bg-gray-100 transition-colors text-black rounded-lg shadow-md"
        >
          Chat Now
        </Link>
      </div>
    </div>
  );
};

export default Profile;
