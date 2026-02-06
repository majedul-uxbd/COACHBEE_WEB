// import Header from "@/components/shared/Header";
import { auth } from "@/auth";
import Footer from "@/components/app-menubar/footer";
import Header from "@/components/app-menubar/header";
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
      <div className="fixed  top-0 left-0 right-0 z-50">
        <Header session={session} />
      </div>
      <main className="flex-1 mt-14">{children}</main>
      <Footer />
    </div>
  );
}