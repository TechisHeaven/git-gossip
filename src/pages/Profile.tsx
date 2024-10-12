import { useEffect } from "react";
import { useAuth } from "../provider/userProvider";

const Profile = () => {
  const { user } = useAuth();
  useEffect(() => {
    console.log(user);
  }, []);

  return <div>Profile</div>;
};

export default Profile;
