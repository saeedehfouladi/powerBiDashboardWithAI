import "./globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "نرم افزار مدیریت دارایی",
  description: "سیستم مدیریت دارایی",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa">
      <body className="min-h-screen flex flex-col">
        <Header />

        <div className="flex flex-1">
          <main className="flex-1 p-4 bg-gray-50">{children}</main>
          <Sidebar />
        </div>
      </body>
    </html>
  );
}
