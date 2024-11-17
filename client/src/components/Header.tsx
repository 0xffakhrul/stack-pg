import { Link } from "react-router-dom";
import { useAuth } from "../context/auth";
import { LogoutButton } from "./LogoutButton";

export const Header = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <nav className="bg-zinc-900 border-b border-zinc-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link
              to="/"
              className="flex gap-2 items-center text-white font-medium"
            >
              <img src="./favicon-16x16.png" alt="" /> <span>Stack</span>
            </Link>
          </div>
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-white">Welcome, {user.name}</span>
              <LogoutButton />
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-white hover:text-gray-300">
                Login
              </Link>
              <Link to="/register" className="text-white hover:text-gray-300">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
