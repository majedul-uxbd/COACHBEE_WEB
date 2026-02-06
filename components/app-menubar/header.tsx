"use client";

import Link from "next/";
import { HousePlus } from "lucide-react";
import React from "react";
import { ModeToggle } from "../shared/mode-toggle";
import { NavUser } from "./nav-user";

const Header = ({ session }: { session: any }) => {
	return (
		<header
			className="h-14 border-b px-4 md:px-5 z-50 
             bg-linear-to-r from-sky-300 to-sky-800 
             dark:from-sky-900 dark:to-sky-600"
		>
			<div className="flex h-full items-center justify-between">
				{/* Desktop Navigation */}
				<nav className="hidden md:flex items-center gap-x-4">
					<div className="flex flex-row items-center gap-x-4">
						<HousePlus className="h-8 w-8" />
						<span className="text-lg font-semibold">ERP System</span>
					</div>
				</nav>

				{/* Mobile Navigation */}
				<div className="flex md:hidden items-center">
					<div className="flex items-center gap-x-2">
						<HousePlus className="h-6 w-6" />
						<span className="text-lg font-semibold">ERP System</span>
					</div>
				</div>
				<div className="flex">
					<ModeToggle />
					<NavUser session={session?.user} />
				</div>
			</div>
		</header>

	);
};

export default Header;
