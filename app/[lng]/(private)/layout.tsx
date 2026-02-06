// import Header from "@/components/shared/Header";
import { auth } from "@/auth";
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
      {/* <Header session={session} /> */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
