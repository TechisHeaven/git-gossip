import { useEffect, useState } from "react";
import { useAuth } from "../provider/userProvider";
import allAvatars from "../assets/avatar.json";
import MainDialog from "../components/Dialog/MainDialog";
import RepoSearchBar from "../components/SearchBar/RepoSearchBar";
import { MainRepositoryType } from "../types/repositories.type";
import RepoSearchedItem from "../components/SearchBar/RepoSearchedItem";
import { LuHome } from "react-icons/lu";
import { MdOutlineHomeWork } from "react-icons/md";
import { IoChevronBack } from "react-icons/io5";
import { avatars } from "../assets/avatar.json";

const ChatGetstarted = () => {
  const { user } = useAuth();

  const [avatarUrls, setAvatarUrls] = useState<
    { url: string; color: string }[]
  >([]);

  // Function to randomize array and colors
  const randomizeAvatars = (urls: string[]) => {
    const shuffledUrls = urls.sort(() => Math.random() - 0.5);
    return shuffledUrls.map((url) => ({
      url,
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Random color
    }));
  };

  useEffect(() => {
    // Assuming you have a way to get all avatar URLs
    const randomizedAvatars = randomizeAvatars(
      allAvatars.avatars.map((avatar) => avatar.url)
    );
    setAvatarUrls(randomizedAvatars);
  }, [user]);

  return (
    <div className="flex flex-col gap-2 items-center max-w-[400px]  mx-auto">
      <div className="items-center flex flex-col gap-2 text-center">
        <img
          src={user?.profileImage || avatarUrls[0]?.url}
          alt="user-image"
          className="w-20 h-20 rounded-full border shadow-sm"
          width={100}
          height={100}
        />
        <h4 className="font-semibold text-lg">Git Gossips</h4>
        <h6 className="text-xs text-gray-400">
          A real-time collaboration tool for developers to chat, share feedback,
          and discuss code directly within GitHub repositories
        </h6>
      </div>
      <div className="avatars-users  p-4 grid grid-rows-4  grid-cols-4 gap-4">
        {avatarUrls.map(
          (
            avatar,
            index // Use avatar object directly
          ) => (
            <div
              key={index}
              style={{ backgroundColor: avatar.color }}
              className="w-16 relative h-16 rounded-full inline-flex items-center justify-center"
            >
              <img
                src={avatar.url}
                alt={`avatar-${index}`}
                className="avatar  overflow-hidden"
                width={60}
                draggable={false}
                height={60}
              />
              {index === 0 && (
                <p className="text-[.5rem] text-black bg-white p-[1px] px-1 rounded-md absolute -bottom-2">
                  ADMIN
                </p>
              )}
            </div>
          )
        )}
        <div className="w-16 h-16 text-black font-semibold text-lg inline-flex items-center justify-center  bg-gray-100 rounded-full overflow-hidden">
          80
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full font-semibold text-base">
        <MainDialog
          className="w-full"
          key={"join-gossip-dialog"}
          heading="Join Gossip Room"
          trigger={
            <button className="rounded-lg w-full bg-white text-mainBackgroundColor border p-3">
              Join Gossip
            </button>
          }
          children={<JoinRoomComponent />}
        />
        <MainDialog
          className="w-full"
          key={"create-gossip-dialog"}
          heading="Create Gossip Room"
          trigger={
            <button className="rounded-lg w-full bg-mainBackgroundColor border-white border text-white  p-3">
              Create Gossip
            </button>
          }
          children={<CreateRoomSteps />}
        />
      </div>
    </div>
  );
};
export default ChatGetstarted;

const JoinRoomComponent = () => {
  const [room, setRoom] = useState<MainRepositoryType | null>(null);
  const isSelected = Boolean(room);

  function handleJoinRoom() {}

  function handleRemoveSelectedItem() {
    setRoom(null);
  }

  return (
    <div className="flex flex-col gap-2">
      <RepoSearchBar setRoom={setRoom} isJoinRoomPage />
      {room && (
        <RepoSearchedItem
          repo={room}
          callback={handleRemoveSelectedItem}
          isBackgroundBlack={true}
          isSelected={isSelected}
        />
      )}
      <button
        onClick={handleJoinRoom}
        disabled={!room}
        className="rounded-lg w-full bg-white text-mainBackgroundColor border p-2 px-4 disabled:opacity-20 transition-opacity"
      >
        Join
      </button>
    </div>
  );
};

type RoomType = "public" | "private";
const CreateRoomSteps = () => {
  const [step, setStep] = useState(1);

  type CreateRoomType = {
    roomName: string;
    roomType: RoomType;
    roomAvatar: string;
    repo: string;
  };
  const [room, setRoom] = useState<CreateRoomType>({
    roomName: "",
    roomType: "public",
    roomAvatar: avatars[0].url,
    repo: "",
  });

  const nextStep = () => {
    if (step >= 3) return;
    setStep((prev) => prev + 1);
  };
  const prevStep = () => setStep((prev) => prev - 1);

  function handleCreateRoom() {}
  return (
    <div>
      {step === 1 && (
        <SelectRoomType
          nextStep={nextStep}
          setRoomType={(type: RoomType) =>
            setRoom((prev) => ({ ...prev, roomType: type }))
          }
          roomType={room.roomType}
          key={"room-type"}
        />
      )}

      {step === 2 && (
        <SelectRoomName
          nextStep={nextStep}
          prevStep={prevStep}
          setRoomName={(name: string) =>
            setRoom((prev) => ({ ...prev, roomName: name }))
          }
          roomName={room.roomName}
          key={"room-name"}
        />
      )}

      {step === 3 && (
        <SelectRoomAvatar
          roomName={room.roomName}
          handleCreateRoom={handleCreateRoom}
          prevStep={prevStep}
          roomAvatar={room.roomAvatar}
          setRoomAvatar={(avatar: string) =>
            setRoom((prev) => ({ ...prev, roomAvatar: avatar }))
          }
          key={"room-avatar"}
        />
      )}
      {/* {step === 4 && (
        <SelectRepo
          roomName={roomName}
          handleCreateRoom={handleCreateRoom}
          prevStep={prevStep}
          roomAvatar={roomAvatar}
          setRoomAvatar={setRoomAvatar}
          key={"room-avatar"}
        />
      )} */}
    </div>
  );
};

const SelectRoomType = ({
  roomType,
  setRoomType,
  nextStep,
}: {
  roomType: RoomType;
  setRoomType: (type: RoomType) => void;
  nextStep: () => void;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-gray-400 text-xs">Select Room Type</h2>
      <div className="tabs flex flex-col gap-2">
        <RoomTypeItemTab
          roomType={roomType}
          setRoomType={setRoomType}
          type="public"
          title="Public Room"
          description="Where everyone can see your code and your bad jokes!"
          icon={<LuHome />}
        />
        <RoomTypeItemTab
          roomType={roomType}
          setRoomType={setRoomType}
          type="private"
          title="Private"
          description=" Gossip freely, but remember: what happens here, stays here (unless
            someone screenshots it)!"
          icon={<MdOutlineHomeWork />}
        />
      </div>
      <NextStepButton key={"next-step-button-type"} nextStep={nextStep} />
    </div>
  );
};

const RoomTypeItemTab = ({
  title,
  description,
  icon,
  type,
  roomType,
  setRoomType,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  type: RoomType;
  roomType: RoomType;
  setRoomType: (type: RoomType) => void;
}) => {
  function handleSelect() {
    setRoomType(type);
  }
  return (
    <div
      onClick={handleSelect}
      className={`tab flex flex-col gap-2 border  transition-colors cursor-pointer p-2 rounded-md ${
        roomType === type ? "bg-black border-gray-400" : "border-gray-600"
      }`}
    >
      <h4 className="text-sm font-semibold inline-flex gap-2 items-center">
        {icon}
        {title}
      </h4>
      <p className="text-xs text-gray-400">{description}</p>
    </div>
  );
};

const SelectRoomName = ({
  roomName,
  setRoomName,
  nextStep,
  prevStep,
}: {
  roomName: string;
  setRoomName: (name: string) => void;
  nextStep: () => void;
  prevStep: () => void;
}) => {
  // Handle Room name Change
  function handleRoomNameChange(
    event: React.ChangeEvent<HTMLInputElement>
  ): void {
    setRoomName(event.target.value as RoomType);
  }
  const isButtonDisabled = roomName.length < 3;
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-gray-400 text-xs">Enter Room Name</h2>
      <div className="tabs flex flex-col gap-2">
        <input
          type="text"
          value={roomName}
          placeholder="Enter Room Name"
          onChange={handleRoomNameChange}
          className="px-4 p-2 outline-none rounded-md shadow-md text-white bg-transparent border-gray-600 border "
        />
      </div>
      <div className="inline-flex items-center w-full gap-2">
        <BackStepButton key={"prev-step-button"} prevStep={prevStep} />
        <NextStepButton
          isDisabled={isButtonDisabled}
          key={"next-step-button-name"}
          nextStep={nextStep}
        />
      </div>
    </div>
  );
};

const SelectRoomAvatar = ({
  roomName,
  roomAvatar,
  setRoomAvatar,
  handleCreateRoom,
  prevStep,
}: {
  roomName: string;
  roomAvatar: string;
  setRoomAvatar: (avatar: string) => void;
  handleCreateRoom: () => void;
  prevStep: () => void;
}) => {
  const [avatarColor, setAvatarColor] = useState<string>("#bf6f91");

  // Function to randomize avatar and background
  const randomizeAvatar = () => {
    const randomIndex = Math.floor(Math.random() * avatars.length);
    const selectedAvatar = avatars[randomIndex].url;
    setRoomAvatar(selectedAvatar);

    // Randomize background color
    const randomBackgroundColor = `#${Math.floor(
      Math.random() * 16777215
    ).toString(16)}`;

    setAvatarColor(randomBackgroundColor);
  };

  // Array of funny quotes based on room name length
  const funnyQuotes = [
    "Wohoooooo! A name only a developer could love: ",
    "404 Name Not Found (but we still believe in you): ",
    "Code it like you mean it (or just copy-paste): ",
    "This name is a semicolon away from greatness (or failure): ",
    "Debugging this name? Good luck with that! ",
    "Syntax error? Nah, just a developer's touch: ",
    "This name is a real catch (like a bug in production): ",
    "Name that makes you go 'Wow!' (or 'What were you thinking?'): ",
    "This name is a real gem (just like your last commit message): ",
    "A name that stands out (like your last pull request): ",
  ];

  // Select a quote based on the length of the room name
  const getQuote = (name: string) => {
    const index = Math.floor(
      Math.random() * Math.min(name.length, funnyQuotes.length)
    );
    return funnyQuotes[index];
  };

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-gray-400 text-xs">Select Room Avatar</h2>
      <div className="tabs flex flex-col gap-2 items-center py-2">
        <img
          style={{ backgroundColor: avatarColor }}
          className={`w-28 aspect-square h-28 object-cover object-center overflow-hidden rounded-full border`}
          src={roomAvatar || avatars[0].url}
          alt=""
          draggable={false}
          onClick={randomizeAvatar}
        />
        <h6 className="text-xs text-gray-400">Click avatar to change</h6>
        <h4 className=" text-sm text-center">
          {getQuote(roomName)} <span className="font-semibold">{roomName}</span>
        </h4>
      </div>

      <div className="inline-flex items-center w-full gap-2">
        <BackStepButton prevStep={prevStep} key={"prev-step-button"} />
        <NextStepButton
          isDisabled={false}
          title={"Create Room"}
          key={"next-step-button-name"}
          nextStep={handleCreateRoom}
        />
      </div>
    </div>
  );
};

const NextStepButton = ({
  nextStep,
  isDisabled = false,
  title = "Continue",
}: {
  nextStep: () => void;
  isDisabled?: boolean;
  title?: string;
}) => {
  return (
    <button
      disabled={isDisabled}
      onClick={nextStep}
      className="rounded-lg font-semibold w-full bg-white text-mainBackgroundColor border p-2 px-4 disabled:opacity-20 transition-opacity"
    >
      {title}
    </button>
  );
};
const BackStepButton = ({ prevStep }: { prevStep: () => void }) => {
  return (
    <button
      onClick={prevStep}
      className="max-w-10 inline-flex items-center justify-center rounded-lg border border-gray-400 w-full aspect-square"
    >
      <IoChevronBack className="text-lg" />
    </button>
  );
};
