import { auth } from "@/auth";

const page = async () => {
  const session = await auth();
  console.log('🚀 ~ page.tsx:5 ~ session:', session);
  return (
    <div className="px-6 py-3">
      <h1 className="text-2xl font-bold mb-4">Home Page</h1>
      <p>Welcome to the home page!</p>
      {session?.user ? (
        <p className="text-lg">Hello, {session.user.fullName}!</p>
      ) : (
        <p className="text-lg">Please log in to see your dashboard.</p>
      )}
    </div>
  );
};

export default page;
