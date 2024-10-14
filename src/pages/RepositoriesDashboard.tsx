import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getRepoById,
  getRepoContentDataByPath,
} from "../services/repositories/service.repositories";
import OwnerProfile from "../components/Owner/OwnerProfile";
import { MainRepositoryType } from "../types/repositories.type";
import { FaFolderClosed, FaFolderOpen } from "react-icons/fa6";

const RepositoriesDashboard = () => {
  const { id } = useParams<{ id: string }>();
  const [repo, setRepo] = useState<MainRepositoryType>();

  useEffect(() => {
    if (!id) return;

    getRepoById(Number(id))
      .then((repo) => {
        setRepo(repo);
      })
      .catch((error) => console.log(error));
  }, [id]);

  return (
    <div>
      <OwnerProfile owner={repo?.owner!} />
      {/* <RawCodeData rawData={repo?.contents_url!} /> */}
      <FileExplorer url={repo?.url!} />
    </div>
  );
};

export default RepositoriesDashboard;

// const RawCodeData = ({ rawData }: { rawData: string }) => {
//   // Your raw text data

//   return (
//     <div
//       className="p-4 bg-gray-100"
//       style={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}
//     >
//       <pre className="border">{rawData}</pre>
//     </div>
//   );
// };

const FileExplorer = ({ url }: { url: string }) => {
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
    } catch (error) {
      console.log(error);
      setLoading(false);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch contents for the path
    fetchContents(path!).then((data) => {
      if (!data) return;
      setCache((prevCache) => ({ ...prevCache, [path!]: data }));
      setContents(data);
    });
  }, [path]);

  const getIndentationLevel = (filePath: string) => {
    // Calculate the depth of the item based on slashes in the path
    return filePath.split("/").length - 1;
  };

  const handleFileClick = (file: any) => {
    console.log(file.download_url); // Example: Fetch raw data
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
      // Expand the folder
      newOpenFolders.add(folderPath);
      // Check if we already have data in cache
      if (cache[folderPath]) {
        setContents((prevContents) => {
          const newContents = [...prevContents];
          newContents.splice(index + 1, 0, ...cache[folderPath]);
          return newContents;
        });
      } else {
        const fetchedContents = await fetchContents(folderPath);

        if (fetchedContents && fetchedContents.length > 0) {
          // Update cache with fetched contents
          setCache((prevCache) => ({
            ...prevCache,
            [folderPath]: fetchedContents,
          }));
          setContents((prevContents) => {
            const newContents = [...prevContents];
            // Insert contents after the folder
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
                  <div onClick={() => handleFileClick(item)}>{item.name}</div>
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
