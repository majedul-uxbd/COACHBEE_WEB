import { auth } from "@/auth";
import StudentsTable from "@/components/students/student-table";

const page = async () => {
  const session = await auth();
  return (
    <div className="px-6 py-3">
      <StudentsTable session={session} />
    </div>
  );
};

export default page;
