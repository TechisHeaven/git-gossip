import React, { SetStateAction, useEffect, useState } from "react";
import { MainRepositoryType } from "../../types/repositories.type";
import { searchRepos } from "../../services/repositories/service.repositories";
import useDebounce from "../../utils/useDebounce";
import { BiSearch } from "react-icons/bi";
import Loader from "../Loader/Loader";
import { useNavigate } from "react-router-dom";
import RepoSearchedItem from "./RepoSearchedItem";

interface RepoSearchBarInterface {
  isJoinRoomPage?: boolean;
  setRoom?: React.Dispatch<SetStateAction<MainRepositoryType | null>>;
  setRepos?: (repos: MainRepositoryType[]) => void;
}
const RepoSearchBar = ({
  isJoinRoomPage = false,
  setRoom,
  setRepos,
}: RepoSearchBarInterface) => {
  const [searchValue, setSearchValue] = useState<string | null>("");
  const debouncedSearchValue = useDebounce(searchValue ? searchValue : "", 300);
  const [searchState, setSearchState] = useState({
    loading: false,
    error: "",
  });
  const [searchReposItems, setSearchReposItems] = useState<
    MainRepositoryType[] | []
  >([]);
  const [selectedRepos, setSelectedRepos] = useState<MainRepositoryType[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRepos = async () => {
      if (debouncedSearchValue) {
        try {
          setSearchState({
            error: "",
            loading: true,
          });
          const result = await searchRepos(debouncedSearchValue);
          setSearchReposItems(result);
          setSearchState({
            error: "",
            loading: false,
          });
        } catch (error) {
          console.log(error);
          setSearchState({
            error: error as string,
            loading: false,
          });
        }
      }
    };

    fetchRepos();
  }, [debouncedSearchValue]);

  function handleSearchValueChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchValue(event.target.value);
  }

  const handleRepoClick = (repo: MainRepositoryType) => {
    if (isJoinRoomPage && setRoom) {
      // For room selection (single repository)
      setRoom(repo);
    } else if (setRepos) {
      // For multiple repository selection
      if (selectedRepos.some((r) => r.id === repo.id)) {
        // If repo is already selected, deselect it
        const updatedRepos = selectedRepos.filter((r) => r.id !== repo.id);
        setSelectedRepos(updatedRepos);
        setRepos(updatedRepos); // Pass updated list to setRepos
      } else {
        // If repo is not selected, add it to selected list
        const updatedRepos = [...selectedRepos, repo];
        setSelectedRepos(updatedRepos);
        setRepos(updatedRepos); // Pass updated list to setRepos
      }
    } else {
      // For navigating to a repository's page
      navigate(`/${repo.id}`);
    }
    setSearchValue(null); // Clear the search bar after selection
  };

  return (
    <div className="relative">
      <div className="inline-flex items-center bg-white text-black shadow-md rounded-full w-full px-2">
        <BiSearch className="text-lg text-gray-600" />
        <input
          type="text"
          placeholder="Search Git Gossips..."
          onChange={handleSearchValueChange}
          autoComplete="off"
          className="p-2 outline-none rounded-full w-full"
        />
      </div>
      {searchValue && searchValue.length > 0 && (
        <div className="searchedRepos rounded-md w-full bg-white absolute top-10 p-2 z-10">
          <h6 className="font-semibold text-xs text-gray-400">
            Popular Repositories
          </h6>
          <ul className="flex flex-col">
            {searchState.loading && <Loader size="sm" color="black" />}
            {searchReposItems.map((repo) => {
              return (
                <RepoSearchedItem
                  repo={repo}
                  callback={() => handleRepoClick(repo)}
                  isSelected={selectedRepos.some((r) => r.id === repo.id)}
                />
              );
            })}
            {searchState.error.length > 0 && (
              <li className="py-1 inline-flex gap-2 items-center">
                <p className="text-red-600">{searchState.error}</p>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RepoSearchBar;
