import { Link } from "react-router-dom";
import MainDialog from "../Dialog/MainDialog";
import ListItem from "./ListItem";
import { useEffect, useState } from "react";
import { currentSelectedRoomType } from "../../types/repositories.type";

const ChatRoom = ({ id }: { id: string | undefined }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] =
    useState<currentSelectedRoomType>(null);
  const [currentSelectedRoom, setCurrentSelectedRoom] = useState<{
    id: string;
  } | null>(null);
  const handleClose = () => {
    setIsOpen(false); // Set isOpen to false when closing the dialog
  };

  useEffect(() => {
    if (id) setSelectedRoom({ id: id }); // Set the selected room based on URL params
  }, [id]);

  const items: { id: string; name: string }[] = [
    {
      id: "870462483",
      name: "Angle Kurtis",
    },
    {
      id: "858526560",
      name: "Angle Kurtis",
    },
  ];

  function onSelect(item: { id: string }) {
    setSelectedRoom(item);
  }
  return (
    <div className="chat-rooms flex flex-col gap-2">
      <MainDialog
        forceDialogTrigger={isOpen}
        isHoldButton={true}
        // trigger={<ChatItem setIsOpen={setIsOpen} />}
        onClose={handleClose}
      >
        <div>{currentSelectedRoom && currentSelectedRoom.id}</div>
      </MainDialog>
      {items.length > 0 ? (
        items.map((item) => {
          return (
            <ListItem
              item={item}
              setIsOpen={setIsOpen}
              isSelected={selectedRoom?.id === item.id}
              onSelect={() => onSelect(item)}
              setCurrentSelectedRoom={setCurrentSelectedRoom}
            />
          );
        })
      ) : (
        <Link
          to={"/gossip/get-started"}
          className="hover:underline p-4 font-semibold text-center"
        >
          Want to have some fun? 😉 Touch me please!😁
        </Link>
      )}
    </div>
  );
};

export default ChatRoom;
