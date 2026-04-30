import { auth } from "@/auth";
import TeachersSalaryTable from "@/components/Payroll/teacher-salary-table";

const Page = async () => {
    const session = await auth();
    return (
        <TeachersSalaryTable session={session} />
    );
};

export default Page;
