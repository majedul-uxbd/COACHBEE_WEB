"use client";

import {
    ChevronsUpDown,
    CircleUserRound,
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
// import { useProfileNameStore, useProfileStore } from "@/assets/store";
import { Badge } from "../ui/badge";
import { ModeToggle } from "../shared/mode-toggle";
import SignOutDialog from "../shared/SignoutDialog";
import { se } from "date-fns/locale";

export function NavUser({ session }: any) {
    // const imageUrl = useProfileStore((state: any) => state.imageUrl);
    // const fullName = useProfileNameStore((state: any) => state.ProfileName);
    const [popOverStage, setPopOverStage] = React.useState<boolean>(false);

    // console.log('🚀 ~ nav-user.tsx:33 ~ session:', session);
    if (!session) return null; // Fallback if session is not available

    return (
        <Popover open={popOverStage} onOpenChange={setPopOverStage}>
            <PopoverTrigger asChild className="cursor-pointer" aria-label="User menu">
                <div className="flex items-center ">
                    <Avatar className="h-8 w-8 rounded-2xl">
                        <AvatarImage
                            src={`${process.env.NEXT_PUBLIC_API_URL}/${session?.profile_img}`}
                            alt={session?.fullName || "User"}
                        />
                        <AvatarFallback className="rounded-lg">
                            <CircleUserRound size={24} />
                        </AvatarFallback>
                    </Avatar>
                </div>
            </PopoverTrigger>
            <PopoverContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg ml-4"
                align="end"
                sideOffset={0}
                side="right"
            >
                <div className="grid gap-2">
                    <div className="flex items-center gap-4 p-2 rounded-lg bg-accent">
                        <Avatar className="h-8 w-8 rounded-2xl">
                            <AvatarImage
                                src={`${process.env.NEXT_PUBLIC_API_URL}/${session?.profile_img}`}
                                alt={session?.fullName || "User"}
                            />
                            <AvatarFallback className="rounded-lg">
                                <CircleUserRound size={24} />
                            </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-start text-sm leading-tight">
                            <span className="truncate font-medium">{session?.fullName}</span>
                            {session?.is_admin && (
                                <Badge variant="default" className="text-xs mt-1">
                                    Admin
                                </Badge>
                            )}
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
                    <div className="pt-2 pb-2 pl-2 hover:bg-accent flex z-30  justify-between text-sm cursor-pointer rounded transition-colors duration-200">
                        <LogOut className="h-5 w-5 mr-3 text-red-600" />
                        <SignOutDialog />
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
