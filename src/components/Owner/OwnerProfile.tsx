import { RepositoryType } from "../../types/repositories.type";

const OwnerProfile = ({ owner }: { owner: RepositoryType["owner"] }) => {
  return (
    <div className="inline-flex items-center gap-2 p-4">
      <img
        src={owner?.avatar_url}
        width={20}
        height={20}
        className="w-5 h-5 rounded-full shadow-sm border"
        alt="Repo-owner-image"
      />
      <h6 className="text-sm font-semibold">{owner?.login}</h6>
    </div>
  );
};

export default OwnerProfile;
