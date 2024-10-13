import { useEffect, useState } from "react";
import { RepositoryType } from "../../types/repositories.type";
import { searchRepos } from "../../services/repositories/service.repositories";
import useDebounce from "../../utils/useDebounce";
import { BiSearch } from "react-icons/bi";
import Loader from "../Loader/Loader";

const RepoSearchBar = () => {
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 300);
  const [searchState, setSearchState] = useState({
    loading: false,
    error: "",
  });
  const [searchReposItems, setSearchReposItems] = useState<RepositoryType[]>(
    []
  );
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
      {searchValue.length > 0 && (
        <div className="searchedRepos rounded-md w-full bg-white absolute top-10 p-2">
          <h6 className="font-semibold text-xs text-gray-400">
            Popular Repositories
          </h6>
          <ul className="flex flex-col">
            {searchState.loading && <Loader size="sm" color="black" />}
            {searchReposItems.map((repo) => {
              return (
                <li className="py-1 inline-flex gap-2 items-center">
                  <img
                    src={repo?.owner.avatar_url}
                    className="w-5 h-5 rounded-full shadow-md border"
                    width={20}
                    height={20}
                    alt=""
                  />
                  <div className="block text-black">
                    <h6 className="text-sm font-semibold">{repo.name}</h6>
                    <p className="text-gray-400">{repo.full_name}</p>
                  </div>
                </li>
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
