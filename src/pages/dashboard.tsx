import Repositories from "../components/Repositories/Repositories";
import Profile from "./Profile";

export const Dashboard = () => {
  return (
    <div className="flex flex-col md:flex-row">
      <Profile />
      <Repositories />
    </div>
  );
};
