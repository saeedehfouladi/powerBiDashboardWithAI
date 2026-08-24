import Link from "next/link";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";
import {
  HiOutlineViewGrid,
  HiOutlineUsers,
  HiOutlineClipboardList,
  HiOutlineFolder,
  HiOutlineSupport,
  HiOutlineBookOpen,
  HiOutlineChartBar,
  HiOutlineDocumentReport,
  HiOutlineUserGroup,
  HiOutlineCog,
} from "react-icons/hi";

const Sidebar = () => {
  return (
    <div>
      <aside className=" w-45 h-full  bg-gray-300 p-2 flex flex-col relative">
        <nav className="flex flex-col gap-1 mt-4 text-right">
          <span className="text-sm text-gray-700 py-1 ">میز کار</span>
          <Link
            href="#"
            className="flex items-center justify-between text-sm text-gray-700 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
          >
            <span className="flex-1 text-right"> پیشخوان</span>
            <HiOutlineViewGrid className="text-base" />
          </Link>
          <Link
            href="#"
            className="flex items-center justify-between text-sm text-gray-700 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
          >
            <span className="flex-1 text-right">کارمند</span>
            <HiOutlineUsers className="text-base" />
          </Link>
          <Link
            href="#"
            className="flex items-center justify-between text-sm text-gray-700 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
          >
            <MdKeyboardArrowLeft className="text-base" />
            <span className="flex-1 text-right">فهرست</span>
            <HiOutlineClipboardList className="text-base" />
          </Link>
          <Link
            href="#"
            className="flex items-center justify-between text-sm text-gray-700 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
          >
            <span className="flex-1 text-right">پروژه ها</span>
            <HiOutlineFolder className="text-base" />
          </Link>
          <Link
            href="#"
            className="flex items-center justify-between text-sm text-gray-700 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
          >
            <MdKeyboardArrowLeft />
            <span className="flex-1 text-right">پشتیبانی</span>
            <HiOutlineSupport className="text-base" />
          </Link>
          <Link
            href="#"
            className="flex items-center justify-between text-sm text-gray-700 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
          >
            <MdKeyboardArrowLeft className="text-base" />
            <span className="flex-1 text-right">تعمیرات و نگهداری</span>
            <HiOutlineWrenchScrewdriver className="text-base" />
          </Link>
          <Link
            href="#"
            className="flex items-center justify-between text-sm text-gray-700 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
          >
            <span className="flex-1 text-right">مدیریت دانش</span>
            <HiOutlineBookOpen className="text-base" />
          </Link>
          <Link
            href="#"
            className="flex items-center justify-between text-sm text-gray-700 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
          >
            <span className="flex-1 text-right">مانیتورینگ</span>
            <HiOutlineChartBar className="text-base" />
          </Link>
          <Link
            href="#"
            className="flex items-center justify-between text-sm text-gray-700 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
          >
            <span className="flex-1 text-right">گزارشات</span>
            <HiOutlineDocumentReport className="text-base" />
          </Link>
          <Link
            href="#"
            className="flex items-center justify-between text-sm text-gray-700 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
          >
            <MdKeyboardArrowLeft className="text-base" />
            <span className="flex-1 text-right">کاربری</span>
            <HiOutlineUserGroup className="text-base" />
          </Link>
          <Link
            href="#"
            className="flex items-center justify-between text-sm text-gray-700 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
          >
            <MdKeyboardArrowLeft className="text-base" />
            <span className="flex-1 text-right">سیستم</span>
            <HiOutlineCog className="text-base" />
          </Link>
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;
