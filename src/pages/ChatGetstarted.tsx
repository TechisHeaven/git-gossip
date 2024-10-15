import { useAuth } from "../provider/userProvider";

const ChatGetstarted = () => {
  const { user } = useAuth();
  return (
    <div>
      <div>
        <img src={user?.profileImage} alt="" />
      </div>
    </div>
  );
};

export default ChatGetstarted;
