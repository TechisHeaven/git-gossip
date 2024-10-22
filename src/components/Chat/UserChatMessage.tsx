import { IoChevronDown } from "react-icons/io5";
import DropDown from "../DropDown/DropDown";
import { filterDateTime } from "../../utils/time/filterTime";
import { MdDeleteOutline } from "react-icons/md";
import { TbArrowForwardUp } from "react-icons/tb";
import { LiaReplySolid } from "react-icons/lia";
import { BiCopy } from "react-icons/bi";
import { useRef } from "react";
import { MessageType } from "../../types/main.type";
import InteractionItems from "./InteractionItem";
import { isFile } from "../../utils/handleFile";
import { getRepoContentDataByPath } from "../../services/repositories/service.repositories";

const UserChatMessage = ({
  isUserMessage,
  repoUrl,
  deleteMessageCallback,
  message: { message, timestamp, id, userId },
  user,
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
}) => {
  const messageRef = useRef<HTMLDivElement | null>(null);
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

  function handleMouseOverToFile() {
    getRepoContentDataByPath(message, repoUrl)
      .then((data) => {
        console.log(data);
      })
      .catch((error) => console.log(error));
  }

  return (
    <div
      className={`gossip-user my-2 inline-flex  ${
        isUserMessage ? "justify-end" : "justify-start"
      }`}
    >
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
                File:
                {message.split(" ").map((word, index) =>
                  isFile(word) ? (
                    <u onMouseOver={handleMouseOverToFile} key={index}>
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
