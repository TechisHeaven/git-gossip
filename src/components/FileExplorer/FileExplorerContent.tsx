import React from "react";
import { CiFileOn } from "react-icons/ci";
import { FaFolderClosed, FaFolderOpen } from "react-icons/fa6";

interface FileExplorerContentProps {
  contents: any[];
  openFolders: Set<string>;
  handleFolderClick: (folderPath: string, index: number) => void;
  handleFileClick: (file: any) => void;
}

const FileExplorerContent = React.memo(
  ({
    contents,
    openFolders,
    handleFolderClick,
    handleFileClick,
  }: FileExplorerContentProps) => {
    // const getIndentationLevel = (filePath: string) => {
    //   // Calculate the depth of the item based on slashes in the path
    //   return filePath.split("/").length - 1;
    // };

    return (
      <ul className="flex flex-col gap-2">
        {contents?.length > 0 ? (
          contents.map((item: any, index: number) => (
            <li
              key={item.sha}
              style={{
                paddingLeft: `${(item.path.split("/").length - 1) * 1.5}rem`,
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
                  className="inline-flex items-center gap-2"
                  onClick={() => handleFileClick(item)}
                >
                  <CiFileOn className="text-lg" />
                  {item.name}
                </div>
              )}
            </li>
          ))
        ) : (
          <div>No contents available</div>
        )}
      </ul>
    );
  }
);

export default FileExplorerContent;
