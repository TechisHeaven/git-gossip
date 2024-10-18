import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getRepoById } from "../services/repositories/service.repositories";
import OwnerProfile from "../components/Owner/OwnerProfile";
import { MainRepositoryType } from "../types/repositories.type";
import FileExplorer from "../components/FileExplorer/FileExplorer";
import Breadcrumb from "../components/BreadCrumb/BreadCrumb";
import CodeViewer from "../components/Code/CodeViewer";
import toast from "react-hot-toast";
import {
  ERROR_MESSAGE_GITHUB_API_LIMIT,
  ERROR_MESSAGE_NOT_FOUND,
} from "../constants";
import { useQuery } from "@tanstack/react-query";
import Loader from "../components/Loader/Loader";
import { CiChat1 } from "react-icons/ci";

export type fileDataType = {
  content: string;
  name: string;
};
const RepositoriesDashboard = () => {
  const { id } = useParams<{ id: string }>();

  const [fileData, setFileData] = useState<fileDataType>({
    content: "",
    name: "",
  });
  const [fileDataLoading, setFileDataLoading] = useState<boolean>(true);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const navigate = useNavigate();

  const {
    data: repo,
    error,
    isLoading,
  } = useQuery<MainRepositoryType>({
    queryKey: ["repo", id],
    retry: false,
    enabled: !!id,
    refetchOnWindowFocus: false,
    queryFn: async () => await getRepoById(Number(id)),
  });

  useEffect(() => {
    if (error) {
      const errorStatus = (error as any).status; // Type assertion to access status
      if (errorStatus === 403) {
        toast.error(ERROR_MESSAGE_GITHUB_API_LIMIT);
        navigate("/");
        return;
      }
      if (errorStatus === 404) {
        toast.error(ERROR_MESSAGE_NOT_FOUND);
        navigate("/");
        return;
      }
    }
  }, [id, error, repo]);

  return repo && isLoading ? (
    <Loader color="white" size="sm" />
  ) : (
    <div className="flex flex-col md:flex-row gap-2">
      <div className="flex flex-col gap-2 items-start">
        <OwnerProfile owner={repo?.owner!} />
        <Link
          to={`/gossip/${repo?.id}`}
          className="px-4 p-2 border inline-flex items-center gap-2 font-semibold bg-white hover:bg-gray-100 transition-colors text-black rounded-lg shadow-md m-4 my-0 whitespace-nowrap"
        >
          <CiChat1 className="text-lg" /> Gossip Now
        </Link>
        {repo?.url && (
          <FileExplorer
            setCurrentPath={setCurrentPath}
            setFileData={setFileData}
            setFileDataLoading={setFileDataLoading}
            url={repo?.url!}
          />
        )}
      </div>
      <div className="w-full">
        <Breadcrumb currentPath={currentPath} />
        {fileDataLoading ? (
          <Loader color="white" size="sm" />
        ) : (
          <CodeViewer content={fileData.content} name={fileData.name} />
        )}
      </div>
    </div>
  );
};

export default RepositoriesDashboard;
