import { auth } from "@/auth";

const page = async () => {
	const session = await auth();
	return (
		<div>
			<h1>Dashboard Page</h1>
		</div>
	);
};

export default page;
