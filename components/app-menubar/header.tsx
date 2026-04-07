"use client";

import { HousePlus } from "lucide-react";
import { ModeToggle } from "../shared/mode-toggle";
import { NavUser } from "./nav-user";
import Image from "next/image";
import Language from "./Language";

const Header = ({ session }: { session: any }) => {
	return (
		<header
			className="h-14 border-b px-4 md:px-5 z-50 bg-accent top-0"
		>
			<div className="flex h-full items-center justify-between">
				{/* Desktop Navigation */}
				<nav className="hidden md:flex items-center gap-x-4">
					<div className="flex flex-row items-center gap-x-4">
						{/* <HousePlus className="h-5 w-5" /> */}
						<Image src="/coachbee/logo.png" alt="Logo" width={144} height={56} className="w-36 cursor-pointer mr-14 dark" />
						{/* <span className="text-lg font-semibold">ERP System</span> */}
					</div>
				</nav>

				{/* Mobile Navigation */}
				<div className="flex md:hidden items-center">
					<div className="flex items-center gap-x-2">
						<HousePlus className="h-6 w-6" />
						<span className="text-lg font-semibold">ERP System</span>
					</div>
				</div>
				<div className="flex items-center justify-center gap-4">
					<Language />
					<ModeToggle />
					<NavUser session={session?.user} />
				</div>
			</div>
		</header>

	);
};

export default Header;
