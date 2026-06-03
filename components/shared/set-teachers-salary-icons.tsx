"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/app/i18n/client";

const TeachersSalaryIcon = () => {
    const pathname = usePathname(); // Get the current path
    const lng = pathname.split("/")[1];
    const { t } = useTranslation(lng, "Language");
    const { theme } = useTheme();

    const iconSrc =
        theme === "dark"
            ? "/coachbee/icons/teacher-salary-dark.svg"
            : "/coachbee/icons/teacher-salary-light.svg";

    return (
        <>
            {/* <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild> */}
            <Image
                src={iconSrc}
                alt="Teachers"
                width={30}
                height={30}
                className="size-5"
            />
            {/* </TooltipTrigger>
                    <TooltipContent
                        side="right"
                        align="center"
                        className="border p-2"
                    >
                        {t("sidebar.teachers_salary")}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider> */}

        </>
    );
};

export default TeachersSalaryIcon;