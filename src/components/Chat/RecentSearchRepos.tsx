import { BiPlus } from "react-icons/bi";
import { Link } from "react-router-dom";

const RecentSearchedRepos = () => {
  return (
    <div className="flex flex-row gap-2 items-center py-2 p-2">
      <div className="flex items-center flex-col gap-2">
        <Link
          to="/gossip/get-started"
          className="recent-repo w-12 h-12 bg-gray-200 rounded-full border inline-flex items-center justify-center"
        >
          <BiPlus className="text-lg text-black" />
        </Link>
        <h6>Add Gossip</h6>
      </div>
      <div className="flex items-center flex-col gap-2">
        <div className="recent-repo w-12 h-12 bg-gray-200 rounded-full  overflow-hidden">
          <img
            className=""
            src="https://avatars.githubusercontent.com/u/95562007?v=4"
            alt=""
          />
        </div>
        <h6>RealTime</h6>
      </div>
    </div>
  );
};

export default RecentSearchedRepos;
