import { useNavigate } from "react-router-dom";
import { SidebarProps } from "../../types/main.type";
import { useEffect } from "react";
import toast from "react-hot-toast";
import {
  ERROR_MESSAGE_GITHUB_API_LIMIT,
  ERROR_MESSAGE_NOT_FOUND,
} from "../../constants";
import Loader from "../Loader/Loader";
import CustomDrawer from "../Drawer/CustomDrawer";
import FileExplorer from "../FileExplorer/FileExplorer";
import Info from "./Information";
import { MainRepositoryType } from "../../types/repositories.type";

const SideBar = ({
  isSidebarOpen,
  onClose,
  error,
  repo,
  isLoading,
}: {
  isSidebarOpen: SidebarProps;
  onClose: () => void;
  error: Error;
  repo: MainRepositoryType;
  isLoading: boolean;
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (error instanceof Error) {
      const errorStatus = (error as any).status;
      if (errorStatus === 203) {
        toast.error(ERROR_MESSAGE_GITHUB_API_LIMIT);
        navigate("/");
        return;
      }
      if (errorStatus === 204) {
        toast.error(ERROR_MESSAGE_NOT_FOUND);
        navigate("/");
        return;
      }
    }
  }, [error]);

  return repo && isLoading ? (
    <Loader color="white" size="sm" />
  ) : (
    <CustomDrawer
      onClose={onClose}
      title={isSidebarOpen.sidebar ? isSidebarOpen.sidebar : "File Explorer"}
      isOpen={isSidebarOpen.isOpen}
    >
      {isSidebarOpen.sidebar === "file_explorer" ? (
        <FileExplorer isRepoPage={false} url={repo.url} />
      ) : (
        <Info />
      )}
    </CustomDrawer>
  );
};

export default SideBar;
