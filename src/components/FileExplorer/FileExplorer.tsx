import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  fetchFileContentByUrl,
  getRepoContentDataByPath,
} from "../../services/repositories/service.repositories";
import { ERROR_MESSAGE_FILE_NOT_FOUND } from "../../constants";
import toast from "react-hot-toast";
import { fileDataType } from "../../pages/RepositoriesDashboard";
import Loader from "../Loader/Loader";
import { useQuery } from "@tanstack/react-query";
import FileExplorerContent from "./FileExplorerContent";

const FileExplorer = ({
  url,
  setFileData,
  setCurrentPath,
  setFileDataLoading,
  isRepoPage = true,
}: {
  url: string;
  setFileData?: Dispatch<SetStateAction<fileDataType>>;
  setCurrentPath?: Dispatch<SetStateAction<string[]>>;
  setFileDataLoading?: Dispatch<SetStateAction<boolean>>;
  isRepoPage?: boolean;
}) => {
  const [contents, setContents] = useState<any[]>([]);
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set()); // Track open folders
  const navigate = useNavigate();
  const { id, "*": path = "/" } = useParams<{ id: string; "*": string }>(); // Capture id and path
  const [cache, setCache] = useState<{ [path: string]: any[] }>({});
  const [searchParams] = useSearchParams();
  const fileSearchParam = searchParams.get("file");
  const fileSearchPath = fileSearchParam ? fileSearchParam.split("/") : [];

  const { data, error, isLoading } = useQuery({
    queryKey: ["repoContents", id, path],
    retry: false,
    enabled: !!id,
    refetchOnWindowFocus: false,
    queryFn: () => getRepoContentDataByPath(path!, url),
  });

  useEffect(() => {
    if (error) {
      toast.error(ERROR_MESSAGE_FILE_NOT_FOUND);
      navigate(`/${id}`);
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      const sortedData = data.sort(
        (a: { type: string }, b: { type: string }) => {
          if (a.type === "dir" && b.type === "file") return -1;
          if (a.type === "file" && b.type === "dir") return 1;
          return 0;
        }
      );
      setCache((prevCache) => ({ ...prevCache, [path!]: sortedData }));
      setContents(sortedData);
      setCurrentPath && setCurrentPath(fileSearchPath);
      // if (isRepoPage && fileSearchPath) {
      //   // openFileOrFolderPath(fileSearchPath);
      // } else if (isRepoPage) {
      if (isRepoPage) {
        const autoSelectFile =
          sortedData.find(
            (item: { name: string }) => item.name === "README.md"
          ) ||
          sortedData.find(
            (item: { name: string }) => item.name === ".gitignore"
          ) ||
          sortedData[sortedData.length - 1];
        if (autoSelectFile && autoSelectFile.type === "file") {
          handleFileClick(autoSelectFile);
        } else {
          toast.error("Please select a file to view its contents.");
        }
      }
      // }
    }
  }, [data]);

  // const openFileOrFolderPath = async (pathParts: string[]) => {
  //   let currentPath = "";
  //   let index = 0;
  //   for (const part of pathParts) {
  //     currentPath = currentPath ? `${currentPath}/${part}` : part;
  //     const folderItem = contents.find((item) => item.name === part);
  //     console.log("folderItem", folderItem);
  //     if (folderItem?.type === "dir") {
  //       await handleFolderClick(currentPath, index);
  //       index++;
  //     } else if (folderItem?.type === "file") {
  //       handleFileClick(folderItem);
  //       break;
  //     }
  //   }
  // };

  const handleFileClick = async (file: any) => {
    try {
      const fileContent = await fetchFileContentByUrl(file?.url);
      const readableData = atob(fileContent.content);
      setFileData &&
        setFileData({ content: readableData, name: fileContent.name });
      setFileDataLoading && setFileDataLoading(false);

      navigate(`/${id}?file=${file.path}`);
    } catch (error) {
      setFileDataLoading && setFileDataLoading(false);
      console.log("Error fetching file content:", error);
    }
  };

  const handleFolderClick = async (folderPath: string, index: number) => {
    const isOpen = openFolders.has(folderPath);
    const newOpenFolders = new Set(openFolders);
    if (isOpen) {
      // Collapse the folder
      newOpenFolders.delete(folderPath);
      setContents((prevContents) => {
        const newContents = [...prevContents];

        return newContents.filter((item, i) => {
          return !(i > index && item.path.startsWith(folderPath));
        });
      });
    } else {
      newOpenFolders.add(folderPath);
      if (cache[folderPath]) {
        setContents((prevContents) => {
          const newContents = [...prevContents];
          newContents.splice(index + 1, 0, ...cache[folderPath]);
          return newContents;
        });
      } else {
        // Removed the fetchContents call since it's no longer needed
        const fetchedContents = await getRepoContentDataByPath(folderPath, url);
        if (fetchedContents && fetchedContents.length > 0) {
          setCache((prevCache) => ({
            ...prevCache,
            [folderPath]: fetchedContents,
          }));
          setContents((prevContents) => {
            const newContents = [...prevContents];
            newContents.splice(index + 1, 0, ...fetchedContents);
            return newContents;
          });
        }
      }
    }

    setOpenFolders(newOpenFolders);
  };
  // navigate(`/${id}/${folderPath}`); // Update the URL with id

  return (
    <div className="p-2 px-4">
      {isLoading ? (
        <Loader color="white" size="sm" />
      ) : (
        <FileExplorerContent
          contents={contents}
          openFolders={openFolders}
          handleFolderClick={handleFolderClick}
          handleFileClick={handleFileClick}
        />
      )}
    </div>
  );
};

export default FileExplorer;
