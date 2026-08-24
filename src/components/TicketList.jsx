import {
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
} from "react-icons/hi";

const TicketList = () => {
  const tickets = [
    {
      id: 1,
      title: "مشکل در اتصال به پایگاه داده",
      status: "در حال بررسی",
      priority: "بالا",
      date: "۱۴۰۲/۰۵/۲۲",
      color: "bg-red-100 text-red-600",
    },
    {
      id: 2,
      title: "درخواست ارتقاء سیستم",
      status: "در انتظار",
      priority: "متوسط",
      date: "۱۴۰۲/۰۵/۲۱",
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      id: 3,
      title: "گزارش باگ در ماژول گزارشات",
      status: "در حال انجام",
      priority: "بالا",
      date: "۱۴۰۲/۰۵/۲۰",
      color: "bg-red-100 text-red-600",
    },
    {
      id: 4,
      title: "درخواست دسترسی جدید",
      status: "بسته شده",
      priority: "پایین",
      date: "۱۴۰۲/۰۵/۱۹",
      color: "bg-green-100 text-green-600",
    },
    {
      id: 5,
      title: "مشکل در سرعت سیستم",
      status: "در حال بررسی",
      priority: "متوسط",
      date: "۱۴۰۲/۰۵/۱۸",
      color: "bg-yellow-100 text-yellow-600",
    },
  ];

  const getStatusIcon = (status) => {
    if (status === "بسته شده")
      return <HiOutlineCheckCircle className="text-green-500" />;
    if (status === "در حال بررسی")
      return <HiOutlineExclamationCircle className="text-red-500" />;
    return <HiOutlineClock className="text-yellow-500" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">تیکت های فعال</h3>
        <span className="text-sm text-gray-400">{tickets.length} تیکت</span>
      </div>

      <div className="space-y-3">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">
                {ticket.title}
              </p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-gray-400">{ticket.date}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${ticket.color}`}
                >
                  {ticket.status}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-gray-500">
                {ticket.priority}
              </span>
              {getStatusIcon(ticket.status)}
            </div>
          </div>
        ))}
      </div>

      <a
        href="#"
        className="mt-4 block text-center text-sm text-blue-500 hover:text-blue-700 font-medium transition-colors"
      >
        مشاهده همه تیکت‌ها →
      </a>
    </div>
  );
};

export default TicketList;
