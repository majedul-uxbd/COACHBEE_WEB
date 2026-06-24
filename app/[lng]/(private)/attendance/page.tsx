import { auth } from "@/auth";
import AttendanceTable from "@/components/attendance/attendance-table";


const AttendancePage = async () => {
    const session = await auth();
    return (
        <AttendanceTable session={session} />
    );
};

export default AttendancePage;
