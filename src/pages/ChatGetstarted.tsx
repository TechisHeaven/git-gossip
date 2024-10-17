import { useEffect, useState } from "react";
import { useAuth } from "../provider/userProvider";
import allAvatars from "../assets/avatar.json";
import MainDialog from "../components/Dialog/MainDialog";
import RepoSearchBar from "../components/SearchBar/RepoSearchBar";
import { MainRepositoryType } from "../types/repositories.type";
import RepoSearchedItem from "../components/SearchBar/RepoSearchedItem";
import { LuHome } from "react-icons/lu";
import { MdOutlineHomeWork } from "react-icons/md";
// import { IoChevronBack } from "react-icons/io5";
import { avatars } from "../assets/avatar.json";
import { Radio, RadioGroup } from "@headlessui/react";
import { BiCheckCircle } from "react-icons/bi";
import { IoChevronBack } from "react-icons/io5";
import { MAX_REPO_ROOM_SELECT_LIMIT, MIN_ROOM_NAME_LENGHT } from "../constants";

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
    repos: MainRepositoryType[];
  };
  const [room, setRoom] = useState<CreateRoomType>({
    roomName: "",
    roomType: "public",
    roomAvatar: avatars[0].url,
    repos: [],
  });

  const nextStep = () => {
    if (step >= 2) return;
    setStep((prev) => prev + 1);
  };
  const prevStep = () => setStep((prev) => prev - 1);

  console.log(nextStep, prevStep);
  // function handleCreateRoom() {}
  const isButtonDisabled =
    (step === 1 && room.roomName.length < MIN_ROOM_NAME_LENGHT) ||
    (step === 2 &&
      (room.repos.length === 0 ||
        room.repos.length > MAX_REPO_ROOM_SELECT_LIMIT));
  return (
    <div>
      {step === 1 && (
        <>
          <SelectRoomAvatar
            roomAvatar={room.roomAvatar}
            setRoomAvatar={(avatar: string) =>
              setRoom((prev) => ({ ...prev, roomAvatar: avatar }))
            }
            key={"room-avatar"}
          />
          <SelectRoomName
            setRoomName={(name: string) =>
              setRoom((prev) => ({ ...prev, roomName: name }))
            }
            roomName={room.roomName}
            key={"room-name"}
          />
          <SelectRoomType
            setRoomType={(type: RoomType) =>
              setRoom((prev) => ({ ...prev, roomType: type }))
            }
            roomType={room.roomType}
            key={"room-type"}
          />
          <p className="text-gray-400 text-xs py-2">
            Create a room to share code and jokes! Fill in the details below to
            start the fun.
          </p>
        </>
      )}

      {step === 2 && (
        <SelectRepo
          setRepos={(repos: MainRepositoryType[]) =>
            setRoom((prev) => ({ ...prev, repos: repos }))
          }
          repos={room.repos}
          key={"room-avatar"}
        />
      )}

      <div className="py-2 inline-flex items-center gap-2 w-full">
        {step === 2 && <BackStepButton prevStep={prevStep} />}
        <NextStepButton
          nextStep={nextStep}
          isDisabled={isButtonDisabled}
          title={step === 2 ? "Create Room" : "Continue"}
        />
      </div>
    </div>
  );
};

const SelectRoomType = ({
  roomType,
  setRoomType,
}: {
  roomType: RoomType;
  setRoomType: (type: RoomType) => void;
}) => {
  const types = [
    {
      title: "public",
      description: "Where everyone can see your code and your bad jokes!",
      icon: <LuHome />,
    },
    {
      title: "private",
      description:
        "Gossip freely, but remember: what happens here, stays here (unlesssomeone screenshots it)!",
      icon: <MdOutlineHomeWork />,
    },
  ];

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-gray-400 text-xs">Select Room Type</h2>
      <div className="tabs flex flex-col gap-2">
        <RadioGroup
          by={(a: RoomType, b: RoomType) => a === b}
          value={roomType}
          onChange={setRoomType}
          className="space-y-2"
        >
          {types.map((type) => (
            <Radio
              key={type.title}
              value={type.title}
              className="group relative flex cursor-pointer rounded-lg bg-white/5 p-2 px-4 text-white shadow-md transition focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-white/10"
            >
              <div className="flex w-full items-center justify-between">
                <div className="text-sm/6">
                  <p className="font-semibold capitalize text-white inline-flex items-center gap-2">
                    {type.icon}
                    {type.title}
                  </p>
                  <div className="flex gap-2 text-white/50 text-xs">
                    <div>{type.description}</div>
                  </div>
                </div>
                <BiCheckCircle className="text-lg fill-white opacity-0 transition group-data-[checked]:opacity-100" />
              </div>
            </Radio>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

const SelectRoomName = ({
  roomName,
  setRoomName,
}: {
  roomName: string;
  setRoomName: (name: string) => void;
}) => {
  // Handle Room name Change
  function handleRoomNameChange(
    event: React.ChangeEvent<HTMLInputElement>
  ): void {
    setRoomName(event.target.value as RoomType);
  }
  return (
    <div className="flex flex-col gap-2 py-2">
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
    </div>
  );
};

const SelectRoomAvatar = ({
  roomAvatar,
  setRoomAvatar,
}: {
  roomAvatar: string;
  setRoomAvatar: (avatar: string) => void;
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

  return (
    <div className="flex flex-col gap-2">
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

const SelectRepo = ({
  setRepos,
  repos,
}: {
  setRepos: (repos: MainRepositoryType[]) => void;
  repos: MainRepositoryType[];
}) => {
  // function handleRemoveSelectedItem(repo: MainRepositoryType) {
  //   console.log(repo);
  // }
  // const isSelected = Boolean(repos);

  return (
    <div>
      <RepoSearchBar
        setRepos={(repos: MainRepositoryType[]) => setRepos(repos)}
      />
      <div className="w-full flex flex-col gap-2 max-h-72 h-full min-h-32 overflow-y-auto">
        {repos.length > 0 &&
          repos.map((repo) => (
            <RepoSearchedItem
              key={repo.id}
              repo={repo}
              callback={() => setRepos(repos.filter((r) => r.id !== repo.id))}
              isSelected={true}
              isBackgroundBlack={true}
            />
          ))}
      </div>
    </div>
  );
};
