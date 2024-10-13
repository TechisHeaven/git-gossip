import { useEffect, useState } from "react";
import { fetchRepos } from "../../services/repositories/service.repositories";
import Repository from "./Repository";
import RepoSearchBar from "../SearchBar/RepoSearchBar";
import { RepositoryType } from "../../types/repositories.type";
import Loader from "../Loader/Loader";

const Repositories = () => {
  const [repos, setRepos] = useState<RepositoryType[]>([]);
  const [repoState, setRepoState] = useState({
    loading: false,
    error: "",
  });

  useEffect(() => {
    async function getRepositories() {
      try {
        setRepoState({ loading: true, error: "" });
        const repo = await fetchRepos();
        setRepos(repo);
        setRepoState({ loading: false, error: "" });
      } catch (error) {
        setRepoState({ loading: false, error: error as string });
      }
    }
    getRepositories();
  }, []);

  return (
    <div className="p-4 w-full">
      <div className="py-2 sticky top-0 bg-mainBackgroundColor shadow-md">
        <RepoSearchBar />
      </div>
      <h1 className="font-semibold text-gray-400 text-sm">Your Repositories</h1>
      {repoState.loading && (
        <div className="py-2">
          <Loader size="sm" color="black" />
        </div>
      )}
      <ul className="flex flex-col gap-4 my-4">
        {!repoState.loading &&
          repos.map((repo: any) => <Repository key={repo.id} repo={repo} />)}
      </ul>
    </div>
  );
};

export default Repositories;
