import { auth } from "@/auth";
import MarkAttendanceComponent from "@/components/attendance/attendance-table";


const MarkAttendancePage = async () => {
    const session = await auth();
    return (
        <MarkAttendanceComponent session={session} />
    );
};

export default MarkAttendancePage;
