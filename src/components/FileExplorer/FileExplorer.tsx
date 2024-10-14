import { FaFolderClosed, FaFolderOpen } from "react-icons/fa6";
import { CiFileOn } from "react-icons/ci";

import { useNavigate, useParams } from "react-router-dom";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  fetchFileContentByUrl,
  getRepoContentDataByPath,
} from "../../services/repositories/service.repositories";
import { ERROR_MESSAGE_FILE_NOT_FOUND } from "../../constants";
import toast from "react-hot-toast";

const FileExplorer = ({
  url,
  setFileData,
  setCurrentPath,
}: {
  url: string;
  setFileData: Dispatch<SetStateAction<string>>;
  setCurrentPath: Dispatch<SetStateAction<string[]>>;
}) => {
  const [contents, setContents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set()); // Track open folders
  const navigate = useNavigate();
  const { id, "*": path } = useParams<{ id: string; "*": string }>(); // Capture id and path
  const [cache, setCache] = useState<{ [path: string]: any[] }>({});

  const fetchContents = async (fetchPath: string) => {
    setLoading(true);
    try {
      const data = await getRepoContentDataByPath(fetchPath, url);
      return data; // Return fetched data
    } catch (error: any) {
      setLoading(false);
      if (error.status === 404) {
        toast.error(ERROR_MESSAGE_FILE_NOT_FOUND);
        navigate(`/${id}`);
        return;
      }
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContents(path!).then((data) => {
      if (!data) return;
      setCache((prevCache) => ({ ...prevCache, [path!]: data }));
      setContents(data);
      setCurrentPath(path!.split("/"));
      console.log(path!.split("/"));
      const autoSelectFile = data.find(
        (item: { name: string }) =>
          item.name === "README.md" || item.name === ".gitignore"
      );
      if (autoSelectFile) {
        handleFileClick(autoSelectFile);
      }
    });
  }, [path]);

  const getIndentationLevel = (filePath: string) => {
    // Calculate the depth of the item based on slashes in the path
    return filePath.split("/").length - 1;
  };

  const handleFileClick = async (file: any) => {
    try {
      const fileContent = await fetchFileContentByUrl(file.url);
      const readableData = atob(fileContent);
      setFileData(readableData);
    } catch (error) {
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
        const fetchedContents = await fetchContents(folderPath);
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

    console.log(id, path, navigate);
  };
  // navigate(`/${id}/${folderPath}`); // Update the URL with id

  return (
    <div className="p-2 px-4">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {contents?.length > 0 ? (
            contents.map((item, index) => (
              <li
                key={item.sha}
                style={{
                  paddingLeft: `${getIndentationLevel(item.path) * 1.5}rem`,
                }}
              >
                {item.type === "dir" ? (
                  <div
                    className="cursor-pointer inline-flex gap-2 items-center font-semibold"
                    onClick={() => handleFolderClick(item.path, index)}
                  >
                    <span>
                      {openFolders.has(item.path) ? (
                        <FaFolderOpen className="text-lg" />
                      ) : (
                        <FaFolderClosed className="text-lg" />
                      )}
                    </span>{" "}
                    {item.name}
                  </div>
                ) : (
                  <div
                    className=" inline-flex items-center gap-2"
                    onClick={() => handleFileClick(item)}
                  >
                    <CiFileOn className="text-lg" />
                    {item.name}
                  </div>
                )}
              </li>
            ))
          ) : (
            <div>Failed to Fetch Repositories</div>
          )}
        </ul>
      )}
    </div>
  );
};

export default FileExplorer;
