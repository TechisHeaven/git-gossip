import { IoChevronDown } from "react-icons/io5";
import DropDown from "../DropDown/DropDown";
import { filterDateTime } from "../../utils/time/filterTime";
import { MdDeleteOutline } from "react-icons/md";
import { TbArrowForwardUp } from "react-icons/tb";
import { LiaReplySolid } from "react-icons/lia";
import { BiCopy } from "react-icons/bi";
import { Dispatch, SetStateAction, useRef, useState, useEffect } from "react";
import {
  HoveredPathProps,
  hoveredPathTypes,
  MessageType,
} from "../../types/main.type";
import InteractionItems from "./InteractionItem";
import { isFile } from "../../utils/handleFile";
import { getRepoContentDataByPath } from "../../services/repositories/service.repositories";
import { useQuery } from "@tanstack/react-query";
import Loader from "../Loader/Loader";

const UserChatMessage = ({
  isUserMessage,
  repoUrl,
  deleteMessageCallback,
  message: { message, timestamp, id, userId },
  user,
  hoveredPath,
  setHoveredPath,
  messageIndex,
}: {
  repoUrl: string;
  isUserMessage: boolean;
  message: MessageType;
  deleteMessageCallback: (id: string) => void;
  user: {
    id: string;
    name: string;
    user_avatar: string;
  };
  hoveredPath: hoveredPathTypes | null;
  setHoveredPath: Dispatch<SetStateAction<HoveredPathProps>>;
  messageIndex: number;
}) => {
  const codePreviewRef = useRef<HTMLDivElement | null>(null);
  const messageRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  const interactionItems = [
    {
      id: "1",
      icon: <BiCopy />,
      title: "copy",
      type: "copy",
    },
    {
      id: "2",
      icon: <LiaReplySolid />,
      title: "Reply",
      type: "reply",
    },
    {
      id: "3",
      icon: <TbArrowForwardUp />,
      title: "forward",
      type: "forward",
    },
    {
      id: "4",
      icon: <MdDeleteOutline />,
      title: "delete",
      type: "delete",
    },
  ];
  // Use React Query to handle Code Preview
  const {
    data: codePreview,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["file", hoveredPath, repoUrl],
    queryFn: () =>
      hoveredPath
        ? getRepoContentDataByPath(hoveredPath.path, repoUrl)
        : Promise.resolve(null),
    enabled: !!hoveredPath,
    refetchOnWindowFocus: false,
    retry: false,
  });

  //Handle Mouse Hover
  function handleMouseOverToFile(path: string) {
    setHoveredPath({ id: messageIndex, path: path });
  }

  function handleCloseCodePreview() {
    setHoveredPath(null);
  }

  // Decode Base64 data into String
  const codePreviewDecodedContent =
    !isLoading && codePreview?.content
      ? atob(codePreview.content)
      : "No Content Available";

  // Handle Path Hover to Render and UnRender Preview Element from DOM
  useEffect(() => {
    if (hoveredPath && hoveredPath.id === messageIndex) {
      setShouldRender(true);
      setTimeout(() => setIsVisible(true), 200);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setShouldRender(false), 400);
      return () => clearTimeout(timer);
    }
  }, [hoveredPath, messageIndex]);

  //Click Outside SetPreviewClose
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        messageRef.current &&
        !messageRef.current.contains(event.target as Node) &&
        codePreviewRef.current &&
        !codePreviewRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
        setHoveredPath(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setHoveredPath]);

  return (
    <div
      className={`gossip-user my-2 inline-flex relative ${
        isUserMessage ? "justify-end" : "justify-start"
      }`}
    >
      {shouldRender && (
        <div
          ref={codePreviewRef}
          className={`codePreview flex flex-col gap-2 absolute m-2 bottom-16 bg-mainBackgroundColor border rounded-xl overflow-auto shadow-md max-h-48 w-96 transition-all duration-300 ${
            isUserMessage ? "origin-bottom-right" : "origin-bottom-left"
          } ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        >
          <div className="flex flex-row justify-between items-center bg-gray-600 p-2">
            <div className="inline-flex items-center gap-2 ">
              {hoveredPath?.path}
              <IoChevronDown
                className="text-lg cursor-pointer"
                onClick={handleCloseCodePreview}
              />
            </div>
            <a
              className="hover:underline text-xs"
              href={codePreview?.html_url}
              target="__blank"
            >
              Github
            </a>
          </div>
          <div className="p-2">
            {isLoading && isFetching ? (
              <Loader color="white" size="sm" />
            ) : (
              <pre className="text-sm text-gray-300 mt-1 whitespace-pre-wrap">
                {codePreviewDecodedContent}
              </pre>
            )}
          </div>
        </div>
      )}

      <div ref={messageRef} className="p-1  inline-flex gap-2 items-start">
        {!isUserMessage && (
          <img
            src={
              user.user_avatar ||
              "https://avatars.githubusercontent.com/u/95562007?v=4"
            }
            alt=""
            draggable="false"
            className="rounded-full overflow-hidden w-8 h-8 aspect-square object-cover"
          />
        )}
        <div className="">
          <div className="title-user px-2 font-semibold text-base inline-flex gap-2 items-center">
            {user.name}
            <span className="time text-xs text-gray-200">
              {filterDateTime(
                typeof timestamp === "string"
                  ? timestamp
                  : JSON.stringify(timestamp)
              )}
            </span>
          </div>
          <div
            className={`message ${
              isUserMessage
                ? "bg-white text-black border  border-gray-600 rounded-xl"
                : "text-white"
            } p-2 `}
          >
            {message.split(" ").some(isFile) ? (
              <span>
                {message.split(" ").map((word, index) =>
                  isFile(word) ? (
                    <u
                      className="cursor-pointer hover:text-blue-600"
                      onMouseOver={() => handleMouseOverToFile(word)}
                      key={index}
                    >
                      {word}{" "}
                    </u>
                  ) : (
                    word + " "
                  )
                )}
              </span>
            ) : (
              message
            )}
          </div>
        </div>
        <DropDown
          attr_key="message"
          target={<IoChevronDown className="text-lg" />}
        >
          <div className="p-2 flex flex-col gap-2">
            <div className="p-2 bg-black/5 border border-gray-600 rounded-lg">
              {message}
            </div>
            <h6
              className="
              text-sm font-semibold"
            >
              React
            </h6>
            <div className="react inline-flex items-center gap-2">
              <div className="item p-2 cursor-pointer">
                <img src="./red-heart.png" width={20} height={20} alt="" />
              </div>
              <div className="item p-2 cursor-pointer">
                <img src="./fire.png" width={20} height={20} alt="" />
              </div>
              <div className="item p-2 cursor-pointer">
                <img src="./thumbs-up.png" width={20} height={20} alt="" />
              </div>
              <div className="item p-2 cursor-pointer">
                <img src="./thumbs-down.png" width={20} height={20} alt="" />
              </div>
              <div className="item p-2 cursor-pointer">
                <img src="./light-bulb.png" width={20} height={20} alt="" />
              </div>
            </div>
            <div className="items flex flex-col gap-2">
              {interactionItems.map((item) => {
                return (
                  <>
                    <InteractionItems
                      key={item.id}
                      icon={item.icon}
                      title={item.title}
                      callback={
                        item.type === "delete"
                          ? () =>
                              deleteMessageCallback(
                                typeof id === "string" ? id : JSON.stringify(id)
                              )
                          : () => console.log(id, userId)
                      }
                    />
                  </>
                );
              })}
            </div>
          </div>
        </DropDown>
      </div>
    </div>
  );
};

export default UserChatMessage;
