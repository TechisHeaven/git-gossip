import { Link } from "react-router-dom";
import { RepositoryType } from "../../types/repositories.type";
import { filterDateTime } from "../../utils/time/filterTime";

const Repository = ({ repo }: { repo: RepositoryType }) => {
  return (
    <Link to={`/${repo.id}`} className="w-full">
      <li
        key={repo.id}
        className="p-4 border border-gray-800 shadow-md rounded-lg inline-flex items-center gap-2 w-full"
      >
        <img
          src={repo.owner.avatar_url}
          alt=""
          width={20}
          height={20}
          className="w-10 h-10 rounded-lg"
        />
        <div className="flex flex-row gap-2 items-center">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex gap-2 items-center hover:underline text-lg font-semibold"
          >
            {repo.name}
          </a>
          <p className="text-gray-400 ">{filterDateTime(repo.updated_at)}</p>
        </div>
      </li>
    </Link>
  );
};

export default Repository;
