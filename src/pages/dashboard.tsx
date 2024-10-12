import { Link } from "react-router-dom";

export const Dashboard = () => {
  return (
    <div>
      Dashboard Page <Link to={`/${window.location.href}`}>GO</Link>
    </div>
  );
};
