"use client";

import {
    ChevronsUpDown,
    LogOut,
    User2,
} from "lucide-react";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../ui/popover";
import { Separator } from "../ui/separator";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useProfileNameStore, useProfileStore } from "@/assets/store";
import SignOutDialog from "../shared/logout-dialog";
import { Badge } from "../ui/badge";
import { ModeToggle } from "../shared/mode-toggle";

export function NavUser({ session }: any) {
    const imageUrl = useProfileStore((state: any) => state.imageUrl);
    const full_name = useProfileNameStore((state: any) => state.ProfileName);
    const [popOverStage, setPopOverStage] = React.useState<boolean>(false);

    if (!session) return null; // Fallback if session is not available

    return (
        <Popover open={popOverStage} onOpenChange={setPopOverStage}>
            <PopoverTrigger asChild className="cursor-pointer" aria-label="User menu">
                <div className="flex items-center ml-3">
                    <Avatar className="h-8 w-8 rounded-2xl">
                        <AvatarImage
                            src={`${process.env.NEXT_PUBLIC_API_URL}/${imageUrl || session?.profile_pic}`}
                            alt={full_name || session?.full_name || "User"}
                        />
                        <AvatarFallback className="rounded-lg">
                            <Image
                                src="/placeholder-image.png"
                                width={32}
                                height={32}
                                alt="Fallback image"
                            />
                        </AvatarFallback>
                    </Avatar>
                    {/* <div className="ml-5 grid flex-1 text-left text-sm">
                        <span className="truncate font-semibold">{full_name || session?.full_name}</span>
                        <span className="truncate text-[11px] uppercase">
                            {session?.designation_name || "Unknown"}
                        </span>
                    </div> */}
                    {/* <ChevronsUpDown className="ml-auto size-4" /> */}
                </div>
            </PopoverTrigger>
            <PopoverContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg ml-4"
                align="end"
                sideOffset={0}
                side="right"
            >
                <div className="grid gap-2">
                    <div className="flex items-center gap-4 p-2 rounded-lg">
                        <Avatar className="h-8 w-8 rounded-2xl">
                            <AvatarImage
                                src={`${process.env.NEXT_PUBLIC_API_URL}/${imageUrl || session?.profile_pic}`}
                                alt={full_name || session?.full_name || "User"}
                            />
                            <AvatarFallback className="rounded-lg">
                                <Image
                                    src="/placeholder-image.png"
                                    width={32}
                                    height={32}
                                    alt="Fallback image"
                                />
                            </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-start text-sm leading-tight">
                            <span className="truncate font-semibold">{full_name || session?.full_name}</span>
                            <span className="truncate text-[11px] uppercase">
                                {session?.designation_name || "Unknown"}
                            </span>
                        </div>
                    </div>
                    <Separator />
                    <Link href={`/profile`}>
                        <div
                            className="pt-2 pb-2 pl-2 hover:bg-accent flex align-middle justify-start text-sm cursor-pointer rounded transition-colors duration-200"
                            onClick={() => setPopOverStage(false)}
                        >
                            <User2 className="h-5 w-5 mr-3" />
                            Profile
                        </div>
                    </Link>
                    <div className="pt-2 pb-2 pl-2 hover:bg-accent flex align-middle justify-start text-sm cursor-pointer rounded transition-colors duration-200">
                        <LogOut className="h-5 w-5 mr-3" />
                        <SignOutDialog />
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
