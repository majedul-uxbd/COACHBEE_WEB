import { auth } from "@/auth";
import TeachersTable from "@/components/teachers/teachers-table";

const page = async () => {
    const session = await auth();
    return (
        <TeachersTable session={session} />
    );
};

export default page;
