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

  return (
    <div>
      Repositories{repos.length}
      <ul>
        {repos.map((repo: any) => (
          <li key={repo.id}>
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex gap-2 items-center"
            >
              <img
                src={repo.owner.avatar_url}
                alt=""
                width={20}
                height={20}
                className="w-10 h-10 rounded-full"
              />{" "}
              {repo.name}
            </a>
            <p>{repo.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Repositories;
