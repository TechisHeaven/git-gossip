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
}
const RepoSearchBar = ({
  isJoinRoomPage = false,
  setRoom,
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

  const handleRepoClick = async (repo: MainRepositoryType) => {
    if (isJoinRoomPage) {
      // Logic for join room page
      // const roomExists = await checkRoomExists(repo.id); // Implement this function
      const roomExists = true;
      if (roomExists && setRoom) {
        // Logic to handle joining the room
        // e.g., setRoomId(roomExists.id);
        setRoom(repo);
        setSearchValue(null);
        setSearchReposItems([]);
      } else {
        alert("Room does not exist.");
      }
    } else {
      // Logic for repo page
      navigate(`/${repo.id}`);
    }
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
          className=" p-2 outline-none rounded-full w-full"
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
