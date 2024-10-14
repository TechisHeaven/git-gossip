import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import AppLayout from "./layout/main.layout";
import Login from "./pages/Login";
import UserProvider, { useAuth } from "./provider/userProvider";
import { Dashboard } from "./pages/dashboard";
import RepositoriesDashboard from "./pages/RepositoriesDashboard";

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/:id/*" element={<RepositoriesDashboard />} />
          <Route path="/auth" element={<AuthRedirect />} />
          <Route path="/*" element={<div>404 page</div>} />
        </Route>
      </Routes>
    </UserProvider>
  );
}

function AuthRedirect() {
  const { user } = useAuth(); // Assuming this hook provides user state
  return user ? <Navigate to="/" /> : <Login />; // Redirect if user exists
}

export default App;
