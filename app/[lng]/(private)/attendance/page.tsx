import { auth } from "@/auth";
import StudentsTable from "@/components/students/student-table";

const Page = async ({ session }: { session: any }) => {
    return (
        <div>
            Attendance Page
        </div>
        // <StudentsTable session={session} />
    );
};

export default Page;
