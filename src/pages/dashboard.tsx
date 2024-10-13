import Repositories from "../components/Repositories/Repositories";
import Profile from "./Profile";

export const Dashboard = () => {
  return (
    <div className="p-4 flex flex-col md:flex-row">
      <Profile />
      <Repositories />
    </div>
  );
};
