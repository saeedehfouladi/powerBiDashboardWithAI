"use client";

import { useState } from "react";

import AssetChart from "@/components/AssetChart";
import TicketList from "@/components/TicketList";
import AIChat from "@/components/AIChat";

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

const boxes = [
  {
    id: 1,
    entity: "tickets",
    color: "bg-purple-500/20",
    linkColor: "bg-purple-500",
    icon: HiOutlineClipboardList,
    title: "همه تیکت ها",
    number: "۱۲",
  },
  {
    id: 2,
    entity: "projects",
    color: "bg-orange-500/20",
    linkColor: "bg-orange-500",
    icon: HiOutlineFolder,
    title: "پروژه ها",
    number: "۳۲",
  },
  {
    id: 3,
    entity: "maintenance_active",
    color: "bg-green-700/20",
    linkColor: "bg-green-700",
    icon: HiOutlineWrench,
    title: "تعمیرات فعال",
    number: "۱۸",
  },
  {
    id: 4,
    entity: "licenses",
    color: "bg-blue-300/20",
    linkColor: "bg-blue-300",
    icon: HiOutlineShieldCheck,
    title: "مجوزها",
    number: "۵۶",
  },
  {
    id: 5,
    entity: "maintenance",
    color: "bg-blue-600/20",
    linkColor: "bg-blue-600",
    icon: HiOutlineCog,
    title: "همه تعمیرات",
    number: "۴۲",
  },
  {
    id: 6,
    entity: "assets",
    color: "bg-green-300/20",
    linkColor: "bg-green-300",
    icon: HiOutlineDatabase,
    title: "دارایی ها",
    number: "۲۸",
  },
  {
    id: 7,
    entity: "employees",
    color: "bg-pink-400/20",
    linkColor: "bg-pink-400",
    icon: HiOutlineUsers,
    title: "کارمندها",
    number: "۱۵",
  },
  {
    id: 8,
    entity: "active_tickets",
    color: "bg-red-300/20",
    linkColor: "bg-red-300",
    icon: HiOutlineClock,
    title: "تیکت های فعال",
    number: "۹",
  },
];

export default function DashboardPage() {
  const [dashboardContext, setDashboardContext] = useState({
    selectedEntity: null,
    selectedSection: null,
  });

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
              <div
                key={box.id}
                onClick={() =>
                  setDashboardContext({
                    selectedEntity: box.entity,
                    selectedSection: "card",
                  })
                }
                className="flex flex-col items-center cursor-pointer"
              >
                <div
                  className={`
                    ${box.color}
                    backdrop-blur-sm
                    w-full rounded-t-xl shadow-lg
                    flex flex-col p-4
                    transition-all duration-300
                    hover:shadow-xl hover:scale-105
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

                <div
                  className={`
                    ${box.linkColor}
                    mt-0 px-4 py-2
                    text-white text-sm font-medium
                    text-center w-full
                  `}
                >
                  مشاهده همه
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 p-4">
        <div className="flex-1">
          <TicketList setDashboardContext={setDashboardContext} />
        </div>

        <div className="lg:w-96 xl:w-80">
          <AssetChart setDashboardContext={setDashboardContext} />
        </div>
      </div>

      <AIChat dashboardContext={dashboardContext} />
    </>
  );
}