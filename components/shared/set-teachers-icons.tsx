"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

const TeacherIcon = () => {
    const { theme } = useTheme();

    const iconSrc =
        theme === "dark"
            ? "/coachbee/icons/teacher_dark.svg"
            : "/coachbee/icons/teacher_light.svg";

    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Image
                            src={iconSrc}
                            alt="Teachers"
                            width={30}
                            height={30}
                            className="size-5 rounded-full"
                        />
                    </TooltipTrigger>
                    <TooltipContent
                        side="right"
                        align="center"
                        className="border p-2"
                    >
                        Teachers
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

        </>
    );
};

export default TeacherIcon;