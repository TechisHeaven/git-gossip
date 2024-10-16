import { CgClose } from "react-icons/cg";
import { MainRepositoryType } from "../../types/repositories.type";

const RepoSearchedItem = ({
  repo,
  callback,
  className,
  isBackgroundBlack = false,
  isSelected = false,
}: {
  repo: MainRepositoryType;
  callback?: (rep?: MainRepositoryType | null) => void;
  className?: React.ComponentProps<"div">["className"];
  isBackgroundBlack?: boolean;
  isSelected?: boolean;
}) => {
  function handleRemoveSelectedItem() {
    if (callback && isSelected) callback();
  }

  function handleSelectItem() {
    !isSelected && callback ? callback(repo) : undefined;
  }
  return (
    <li
      onClick={handleSelectItem}
      className={`py-1 inline-flex justify-between items-center ${
        !isSelected && "hover:bg-gray-100  transition-colors cursor-pointer"
      } ${className}`}
    >
      <div className="inline-flex items-center gap-2">
        <img
          src={repo.owner.avatar_url}
          className="w-5 h-5 rounded-full shadow-md border"
          width={20}
          height={20}
          alt=""
        />
        <div
          className={`block  ${
            isBackgroundBlack ? "text-white" : "text-black"
          }`}
        >
          <h6 className="text-sm font-semibold">{repo.name}</h6>
          <p className="text-gray-400">{repo.full_name}</p>
        </div>
      </div>
      {isSelected && (
        <div className="px-4">
          <CgClose
            className="text-sm cursor-pointer text-gray-400"
            onClick={handleRemoveSelectedItem}
          />
        </div>
      )}
    </li>
  );
};

export default RepoSearchedItem;
