import { auth } from "@/auth";
import StudentPaymentsTable from "@/components/Payroll/student-payment-table";

const Page = async () => {
    const session = await auth();
    return (
        <StudentPaymentsTable session={session} />
    );
};

export default Page;
