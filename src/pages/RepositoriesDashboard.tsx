import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRepoById } from "../services/repositories/service.repositories";
import OwnerProfile from "../components/Owner/OwnerProfile";
import { MainRepositoryType } from "../types/repositories.type";
import FileExplorer from "../components/FileExplorer/FileExplorer";
import Breadcrumb from "../components/BreadCrumb/BreadCrumb";
import CodeViewer from "../components/Code/CodeViewer";
import toast from "react-hot-toast";
import { ERROR_MESSAGE_GITHUB_API_LIMIT } from "../constants";

const RepositoriesDashboard = () => {
  const { id } = useParams<{ id: string }>();
  const [repo, setRepo] = useState<MainRepositoryType>();
  const [fileData, setFileData] = useState<string>("");
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (!id) return;

    getRepoById(Number(id))
      .then((repo) => {
        setRepo(repo);
      })
      .catch((error) => {
        console.log("error: ", error, error.message);
        if (error.status === 403) {
          toast.error(ERROR_MESSAGE_GITHUB_API_LIMIT);
          navigate("/");
        }
      });
  }, [id]);

  return (
    <div className="flex flex-col md:flex-row gap-2">
      <div>
        <OwnerProfile owner={repo?.owner!} />
        <FileExplorer
          setCurrentPath={setCurrentPath}
          setFileData={setFileData}
          url={repo?.url!}
        />
      </div>
      <div className="w-full">
        <Breadcrumb currentPath={currentPath} />
        <CodeViewer rawData={fileData} />
      </div>
    </div>
  );
};

export default RepositoriesDashboard;
