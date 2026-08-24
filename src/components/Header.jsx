import UserProfile from "./UserProfile";
import { CiSearch } from "react-icons/ci";

const Header = () => {
  return (
    <header className="bg-gray-100 p-2 border-b border-gray-600 flex items-center justify-between">
      <UserProfile />

      <div className="flex-1 max-w-md mx-4">
        <div className="border border-gray-500 rounded flex items-center px-2 py-1 bg-white/30">
          <input
            type="text"
            placeholder="جستجو..."
            className="flex-1 bg-transparent outline-none text-xs text-gray-700 placeholder-gray-400 text-right"
          />
          <CiSearch className="text-xs text-gray-500 shrink-0 ml-1" />
        </div>
      </div>

      <h1 className="font-bold text-lg whitespace-nowrap">
        نرم افزار مدیریت دارایی
      </h1>
    </header>
  );
};

export default Header;
