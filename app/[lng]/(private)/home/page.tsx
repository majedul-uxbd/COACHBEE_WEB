import { auth } from "@/auth";
import AttendancePage from "../attendance/page";

const page = async () => {
	const session = await auth();
	return (
		<div>
			{session?.user?.role === "admin" ? (
				<h1>Admin Dashboard</h1>
			) : session?.user?.role === "teacher" ? (
				<AttendancePage />
			) : (
				<h1>Dashboard Page</h1>
			)}
		</div>
	);
};

export default page;
