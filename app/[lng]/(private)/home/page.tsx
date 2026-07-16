import { auth } from "@/auth";
import MarkAttendancePage from "../attendance/mark-attendance/page";

const page = async () => {
	const session = await auth();
	return (
		<div>
			{session?.user?.role === "admin" ? (
				<h1>Admin Dashboard</h1>
			) : session?.user?.role === "teacher" ? (
				<MarkAttendancePage />
			) : (
				<h1>Dashboard Page</h1>
			)}
		</div>
	);
};

export default page;
