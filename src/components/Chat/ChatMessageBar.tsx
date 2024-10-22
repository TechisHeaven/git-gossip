import { useEffect, useRef, useState } from "react";
import { BiPlus } from "react-icons/bi";
import { IoSend } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query"; // Import useQuery
import { fetchFileBySearchContentGraphQl } from "../../services/repositories/service.repositories";
import useDebounce from "../../utils/useDebounce";
import Loader from "../Loader/Loader";
import { extractFileName, isFile } from "../../utils/handleFile";

const predefinedCommands = [
  { id: 1, name: "/search", description: "Search for files" },
  { id: 2, name: "/help", description: "Show help options" },
];

interface CommandOption {
  id: number;
  name: string;
  type?: string;
  description: string;
  text?: string;
}

const ChatMessageBar = ({
  messageRef,
  callback,
}: {
  messageRef: React.RefObject<HTMLInputElement>;
  callback: (message: string, fileContext?: CommandOption) => void;
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [filteredCommands, setFilteredCommands] = useState<CommandOption[]>([]);
  const [commandInput, setCommandInput] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const {
    data: searchResults,
    refetch,
    error,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["fileSearch", searchTerm],
    queryFn: () =>
      fetchFileBySearchContentGraphQl(
        `main:${searchTerm.startsWith("/") ? searchTerm.slice(1) : searchTerm}`
      ),

    enabled:
      !!debouncedSearchTerm &&
      commandInput === "/search" &&
      !isFile(debouncedSearchTerm),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (commandInput === "/search" && debouncedSearchTerm.trim().length > 0) {
      refetch();
    }
  }, [commandInput, searchTerm, refetch]);

  useEffect(() => {
    if (searchResults && commandInput === "/search") {
      const commands = searchResults.map((file: any) => ({
        name: file.name,
        type: file.type,
        description:
          file.type === "tree"
            ? "Folder"
            : file.type === "blob"
            ? "Code"
            : "File",
        text: file.type === "blob" ? file.object.text : undefined,
        path: file.name,
      }));

      // Separate folders and files
      const folders = commands.filter(
        (command: { type: CommandOption["type"] }) => command.type === "tree"
      );
      const files = commands.filter(
        (command: { type: CommandOption["type"] }) => command.type !== "tree"
      );

      // Combine folders first, then files
      setFilteredCommands([...folders, ...files]);
      setDropdownVisible(true); // Show the dropdown
    }
  }, [searchResults, commandInput]);

  useEffect(() => {
    if (activeIndex !== -1 && itemRefs.current[activeIndex]) {
      itemRefs.current[activeIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [activeIndex]);

  // Function to handle command selection
  const handleCommandSelection = (command: CommandOption) => {
    if (command.type && messageRef.current) {
      if (command.type === "file" || command.type === "blog") {
        messageRef.current.value = command.name;
        setCommandInput("");
      } else {
        const currentCommand = searchTerm;
        const newCommand = command.name;
        if (currentCommand !== "/search") {
          const newSearchTerm = currentCommand
            ? `${currentCommand}/${newCommand}`
            : newCommand;
          messageRef.current.value = newSearchTerm;
          setCommandInput("/search");
          setSearchTerm(newSearchTerm);
        } else {
          messageRef.current.value = command.name;
          setCommandInput("/search");
          setSearchTerm(command.name);
        }
      }
    } else {
      if (!messageRef.current) return;
      messageRef.current.value = "";
      setDropdownVisible(false);
      setCommandInput(command.name);
      messageRef.current?.focus();
      setSearchTerm("");
      if (command.name === "/search") {
        setSearchTerm("");
      }
    }
  };

  useEffect(() => {
    messageRef.current?.focus();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim();
    setSearchTerm(value);
    setActiveIndex(-1);

    const isFilePath = isFile(extractFileName(value));
    if (isFilePath) {
      setFilteredCommands([
        {
          id: 0,
          name: value,
          type: "file",
          description: "File",
        },
      ]);
      setDropdownVisible(true);
    } else if (value.startsWith("/search")) {
      const searchValue = value.replace("/search", "").trim();
      setSearchTerm(
        searchValue.startsWith("/") ? searchValue.slice(1) : searchValue
      );
      setCommandInput("/search");
    } else if (value.startsWith("/")) {
      const commandTerm = value.substring(1).toLowerCase(); // Get the command name
      setFilteredCommands(
        predefinedCommands.filter((command) =>
          command.name.toLowerCase().includes(commandTerm)
        )
      );
      setDropdownVisible(true);
    } else {
      setDropdownVisible(false);
    }
  };

  const displayedCommands = (() => {
    if (searchTerm.startsWith("/search")) {
      const strippedSearchTerm = searchTerm.replace("/search", "").trim();
      const searchFileName = extractFileName(strippedSearchTerm);
      return filteredCommands.filter((command) => {
        return (
          command.type === "blob" &&
          searchFileName &&
          command.name.toLowerCase().includes(searchFileName.toLowerCase())
        );
      });
    } else if (isFile(searchTerm)) {
      const searchFileName = extractFileName(searchTerm);
      return filteredCommands.filter((command) => {
        return (
          command.type === "blob" &&
          searchFileName &&
          command.name.toLowerCase().includes(searchFileName.toLowerCase())
        );
      });
    } else {
      return filteredCommands;
    }
  })();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (dropdownVisible && filteredCommands.length > 0) {
      if (event.key === "ArrowDown") {
        // Navigate down the list
        setActiveIndex((prevIndex) =>
          prevIndex < filteredCommands.length - 1 ? prevIndex + 1 : 0
        );
      } else if (event.key === "ArrowUp") {
        // Navigate up the list
        setActiveIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : filteredCommands.length - 1
        );
      } else if (event.key === "Enter" && activeIndex !== -1) {
        // Select the current active item
        handleCommandSelection(filteredCommands[activeIndex]);
        setDropdownVisible(false);
      }
    }

    if (event.key === "Backspace" && searchTerm.length === 0) {
      setCommandInput("");
      setDropdownVisible(false);
    }
  };
  const handleSendMessage = () => {
    if (messageRef.current) {
      const message = messageRef.current.value.trim();
      const selectedFile = filteredCommands.find(
        (cmd) => cmd.name === extractFileName(message)
      );
      if (selectedFile) {
        callback(message, selectedFile);
      } else {
        callback(message);
      }
      messageRef.current.value = "";
      setCommandInput("");
      setSearchTerm("");
      setDropdownVisible(false);
    }
  };
  return (
    <div className="absolute gap-2 bottom-0 left-0 right-0 p-2 bg-mainBackgroundColor flex items-center">
      <div className="">
        {dropdownVisible && (
          <div className="max-h-60 overflow-y-auto absolute bottom-full mb-2 w-full bg-gray-800 text-white rounded-md shadow-lg z-10">
            {error && error.message}
            {isLoading || isFetching ? (
              <Loader color="white" size="sm" />
            ) : displayedCommands.length > 0 ? (
              displayedCommands.map((command, index) => (
                <div
                  key={index}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-700 ${
                    index === activeIndex ? "bg-gray-700" : ""
                  }`}
                  onClick={() => handleCommandSelection(command)}
                  ref={(el) => (itemRefs.current[index] = el)}
                >
                  <div className="font-bold">{command.name}</div>
                  <div className="text-xs text-gray-400 ">
                    {command.description}
                  </div>
                  {searchTerm.includes(command.name) &&
                    command.type === "blob" &&
                    command.text && (
                      <pre className="text-sm text-gray-300 mt-1 whitespace-pre-wrap">
                        {command.text}
                      </pre>
                    )}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-400">
                No result found
              </div>
            )}
          </div>
        )}
      </div>
      <button className="p-2 rounded-full hover:bg-gray-200 transition-colors hover:text-white text-gray-200">
        <BiPlus className="text-lg " />
      </button>
      <div className="flex-1 inline-flex items-center gap-2">
        {commandInput && (
          <span
            className="text-blue-500 font-bold cursor-pointer"
            onClick={() => setCommandInput("")}
          >
            {commandInput.replace("/", "")}
          </span>
        )}
        <input
          ref={messageRef}
          type="text"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={commandInput ? `${commandInput}:` : "Your message"} // Update placeholder
          className="outline-none rounded-full p-2 px-4 bg-gray-800 w-full"
        />
      </div>
      <button onClick={handleSendMessage} className="rounded-md px-4 py-2">
        <IoSend className="text-lg tex-gray-200" />
      </button>
    </div>
  );
};

export default ChatMessageBar;
