import { auth } from "@/auth";
import StudentsTable from "@/components/students/student-table";

const page = async () => {
    const session = await auth();
    return (
        <StudentsTable session={session} />
    );
};

export default page;
