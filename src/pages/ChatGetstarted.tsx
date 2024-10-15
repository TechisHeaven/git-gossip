import { useEffect, useState } from "react";
import { useAuth } from "../provider/userProvider";
import allAvatars from "../assets/avatar.json";

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
    <div className="flex flex-col gap-2 items-center">
      <div className="items-center flex flex-col gap-2 text-center">
        <img
          src={user?.profileImage}
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
      <div className="avatars-users max-w-[400px] p-4 grid grid-rows-4  grid-cols-4 gap-4">
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

      <div className="flex flex-col gap-2 w-full max-w-[400px] font-semibold text-base">
        <button className="rounded-lg bg-white text-mainBackgroundColor border p-3">
          Join Gossip
        </button>
        <button className="rounded-lg bg-mainBackgroundColor border-white border text-white  p-3">
          Create Gossip
        </button>
      </div>
    </div>
  );
};
export default ChatGetstarted;
