import { FaUserCircle } from "react-icons/fa";

const UserProfile = () => {
  return (
    <div className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors">
      <div className="relative">
        <FaUserCircle className="text-3xl text-gray-600" />

        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
      </div>

      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-700">کاربر</span>
        <span className="text-xs text-gray-400">مدیر سیستم</span>
      </div>
    </div>
  );
};

export default UserProfile;
