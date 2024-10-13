import { useEffect, useState } from "react";
import { fetchRepos } from "../../services/repositories/service.repositories";

const Repositories = () => {
  const [repos, setRepos] = useState([]);
  useEffect(() => {
    async function getRepositories() {
      const repo = await fetchRepos();
      setRepos(repo);
    }
    getRepositories();
  }, []);

  function timeAgo(date: string) {
    const seconds = Math.floor(
      (new Date().getTime() - new Date(date).getTime()) / 1000
    );

    // If the time difference is less than a minute, return "just now"
    if (seconds < 60) return "just now";

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1)
      return interval === 1 ? "1 year ago" : `${interval} years ago`;

    interval = Math.floor(seconds / 2592000);
    if (interval >= 1)
      return interval === 1 ? "1 month ago" : `${interval} months ago`;

    interval = Math.floor(seconds / 86400);
    if (interval >= 1)
      return interval === 1 ? "1 day ago" : `${interval} days ago`;

    interval = Math.floor(seconds / 3600);
    if (interval >= 1)
      return interval === 1 ? "1 hour ago" : `${interval} hours ago`;

    interval = Math.floor(seconds / 60);
    if (interval >= 1)
      return interval === 1 ? "1 minute ago" : `${interval} minutes ago`;

    return "just now"; // Fallback case, should not reach here
  }

  return (
    <div>
      <ul className="flex flex-col gap-4">
        {repos.map((repo: any) => (
          <li
            key={repo.id}
            className="p-4 border border-gray-600 shadow-md rounded-lg inline-flex items-center gap-2"
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
              <p className="text-gray-400 ">{timeAgo(repo.updated_at)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Repositories;
