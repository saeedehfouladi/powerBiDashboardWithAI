import AssetChart from "@/components/AssetChart";
import { HiOutlineWrench } from "react-icons/hi2";
import { LuSlash } from "react-icons/lu";
import {
  HiOutlineHome,
  HiOutlineClipboardList,
  HiOutlineFolder,
  HiOutlineShieldCheck,
  HiOutlineCog,
  HiOutlineDatabase,
  HiOutlineUsers,
  HiOutlineClock,
} from "react-icons/hi";
import TicketList from "@/components/TicketList";

const boxes = [
  {
    id: 1,
    color: "bg-purple-500/20",
    linkColor: "bg-purple-500",
    icon: HiOutlineClipboardList,
    title: "همه تیکت ها",
    number: "۱۲",
  },
  {
    id: 2,
    color: "bg-orange-500/20",
    linkColor: "bg-orange-500",
    icon: HiOutlineFolder,
    title: "پروژه ها",
    number: "۳۲",
  },
  {
    id: 3,
    color: "bg-green-700/20",
    linkColor: "bg-green-700",
    icon: HiOutlineWrench,
    title: "تعمیرات و نگهداری فعال",
    number: "۱۸",
  },
  {
    id: 4,
    color: "bg-blue-300/20",
    linkColor: "bg-blue-300",
    icon: HiOutlineShieldCheck,
    title: "مجوزها",
    number: "۵۶",
  },
  {
    id: 5,
    color: "bg-blue-600/20",
    linkColor: "bg-blue-600",
    icon: HiOutlineCog,
    title: "همه تعمیرات و نگهداری",
    number: "۴۲",
  },
  {
    id: 6,
    color: "bg-green-300/20",
    linkColor: "bg-green-300",
    icon: HiOutlineDatabase,
    title: "دارایی ها",
    number: "۲۸",
  },
  {
    id: 7,
    color: "bg-pink-400/20",
    linkColor: "bg-pink-400",
    icon: HiOutlineUsers,
    title: "کارمندها",
    number: "۱۵",
  },
  {
    id: 8,
    color: "bg-red-300/20",
    linkColor: "bg-red-300",
    icon: HiOutlineClock,
    title: "تیکت های فعال",
    number: "۹",
  },
];

const page = () => {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <span className="text-gray-700">میز کار</span>
          <LuSlash className="text-sm text-gray-300" />
          <span>خانه</span>
          <HiOutlineHome className="text-sm" />
        </div>
        <h2 className="font-bold text-lg">پیشخوان</h2>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-4 gap-4">
          {boxes.map((box) => {
            const Icon = box.icon;
            return (
              <div key={box.id} className="flex flex-col items-center">
                <div
                  className={`
                    ${box.color}
                    backdrop-blur-sm
                    w-full rounded-t-xl shadow-lg
                    flex flex-col p-4
                    transition-all duration-300 hover:shadow-xl hover:scale-105
                    relative overflow-hidden
                    h-32
                  `}
                >
                  <div className="flex items-start justify-between">
                    <Icon className="text-4xl text-gray-700/40" />
                    <span className="text-2xl font-bold text-gray-700">
                      {box.number}
                    </span>
                  </div>
                  <div className="mt-auto text-right">
                    <span className="text-sm font-medium text-gray-700">
                      {box.title}
                    </span>
                  </div>
                </div>
                <a
                  href="#"
                  className={`
                    ${box.linkColor}
                    mt-0 px-4 py-2
                    text-white text-sm font-medium text-center
                    transition-all duration-300 w-full
                    hover:shadow-md
                    border-t border-white/10
                  `}
                >
                  مشاهده همه
                </a>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 p-4">
        <div className="flex-1">
          <TicketList />
        </div>

        <div className="lg:w-96 xl:w-80">
          <AssetChart />
        </div>
      </div>
    </>
  );
};

export default page;
