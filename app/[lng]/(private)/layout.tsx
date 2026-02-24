// import Header from "@/components/shared/Header";
import { auth } from "@/auth";
import Footer from "@/components/app-menubar/footer";
import Header from "@/components/app-menubar/header";
import SidebarPage from "@/components/app-menubar/sidenav";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/en/login");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed bg-accent top-0 left-0 right-0 z-50">
        <Header session={session} />
      </div>
      <div className="flex w-full flex-1">
        <SidebarPage session={session?.user} />
        <main className="flex-1 w-full mx-2 h-[calc(100%-125px)] my-16 overflow-hidden">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}