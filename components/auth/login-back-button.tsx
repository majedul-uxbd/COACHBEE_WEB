"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link";

interface BackButtonProps {
    label: string;
    href: string;
}
export const BackButton = ({
    label,
    href
}: BackButtonProps) => {
    return (
        <div>
            <Button
                variant='link'
                className="font-normal text-slate-500 w-full"
                size='sm'
                asChild
            >
                <Link href={href}>
                    {label}
                </Link>
            </Button>
        </div>
    )
}