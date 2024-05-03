import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
// export const metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({ children }) {
  return (
       <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="w-full pt-16 overflow-y-auto">{children}</main>
      </div>
    </>
  );
}