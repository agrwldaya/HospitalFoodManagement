import { Bell, User } from "lucide-react";
 
const Header = () => {
  const username = localStorage.getItem("username") || "User";
  const email = localStorage.getItem("email") || "user@example.com";

  return (
    <header className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo and Welcome Message */}
        <div className="flex items-center space-x-4">
           
          <h1 className="text-2xl font-bold text-white">Welcome back, {username}!</h1>
        </div>

        {/* Profile and Notification Section */}
        <div className="flex items-center space-x-6">
          {/* Notifications */}
          <button className="relative hover:text-teal-100 transition-colors">
            <Bell className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-teal-700">
              3
            </span>
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-teal-800 bg-opacity-30 rounded-full flex items-center justify-center overflow-hidden border-2 border-teal-500">
              <User className="h-7 w-7 text-white" />
            </div>
            <div className="text-sm">
              <p className="font-semibold text-white">{username}</p>
              <p className="text-teal-100 text-xs">{email}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;