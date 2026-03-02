"use client";

import {
	BriefcaseBusiness,
	ChartLine,
	LayoutDashboard,
	Map,
	MapPin,
	MenuIcon,
	Presentation,
	Settings2,
	StoreIcon,
	UsersRound,
	Wallet,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CSSObject, Menu, MenuItem, Sidebar, SubMenu } from "react-pro-sidebar";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/tooltip";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import TeacherIcon from "../shared/set-teachers-icons";

interface SidebarPageProps {
	session: any;
}

const SidebarPage = ({ session }: SidebarPageProps) => {
	const [collapsed, setCollapsed] = useState<boolean | null>(null);
	const [isMobile, setIsMobile] = useState(false);
	const pathname = usePathname(); // Get the current path

	useEffect(() => {
		const handleResize = () => {
			const isSmallScreen = window.innerWidth <= 780;
			setIsMobile(isSmallScreen);

			if (isSmallScreen) {
				setCollapsed(true); // Always collapse on mobile
			} else {
				const savedState = localStorage.getItem("sidebarCollapsed");
				setCollapsed(savedState === "true");
			}
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const toggleSidebar = () => {
		if (isMobile) return;

		const newState = !collapsed;
		setCollapsed(newState);
		localStorage.setItem("sidebarCollapsed", String(newState));
	};

	if (collapsed === null) return null;

	const headerHeight = "57px";
	const footerHeight = "36px";
	const sidebarWidth = collapsed ? "80px" : "250px";

	const sidebarStyles: CSSObject = {
		backgroundColor: "hsl(var(--background))",
		borderRight: "1px solid hsl(var(--border))",
		transition: "all 0.3s ease-in-out",
		boxShadow: "none",
		position: "fixed",
		top: headerHeight,
		bottom: footerHeight,
		width: sidebarWidth,
		height: `calc(100% - ${headerHeight}) +calc(100% - ${footerHeight})`,
		"&:hover": {
			backgroundColor: "hsl(var(--background))",
		},
	};

	const containerStyles: React.CSSProperties = {
		marginLeft: sidebarWidth,
		transition: "margin-left 0.3s ease-in-out",
	};

	const isActiveRoute = (route: string) => pathname === route; // Check if route is active

	return (
		<div className="z-1 border">
			<Sidebar
				backgroundColor="bg-background"
				collapsed={collapsed}
				toggled={!collapsed}
				rootStyles={sidebarStyles}
			>
				<div className="flex flex-col justify-around">
					<Menu className="h-full" menuItemStyles={{
						button: {
							'&:hover': {
								backgroundColor: 'transparent', // removes hover color
							},
						},
					}}>
						<MenuItem onClick={toggleSidebar} className="hidden md:block">
							<MenuIcon className="ml-2 size-6" />
						</MenuItem>
					</Menu>
					<>
						{/* Dashboard Menu Item */}
						<Menu className="h-full" menuItemStyles={{
							button: {
								'&:hover': {
									backgroundColor: 'transparent', // removes hover color
								},
							},
						}}>
							<MenuItem
								component={<Link href="/en/home" />}
								className={cn(isActiveRoute("/en/home") && "bg-accent")}
								icon={
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<LayoutDashboard className="size-4" />
											</TooltipTrigger>
											<TooltipContent
												side="right"
												align="center"
												className="border p-2"
											>
												Dashboard
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								}
							>
								<p className="text-[14px]">
									Dashboard
								</p>
							</MenuItem>
						</Menu>

						{/* Teachers Menu Item */}
						<Menu menuItemStyles={{
							button: {
								'&:hover': {
									backgroundColor: 'transparent', // removes hover color
								},
							},
						}}>
							<MenuItem
								component={<Link href="/en/teachers" />}
								className={cn(isActiveRoute("/en/teachers") && "bg-accent")}
								icon={
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												{/* <UsersRound className="size-4" /> */}
												<TeacherIcon />
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
								}
							>
								<p className="text-[14px]">
									Teachers
								</p>
							</MenuItem>
						</Menu>

						{/* Students Menu Item */}
						<Menu menuItemStyles={{
							button: {
								'&:hover': {
									backgroundColor: 'transparent', // removes hover color
								},
							},
						}}>
							<MenuItem
								component={<Link href="/en/students" />}
								className={cn(isActiveRoute("/en/students") && "bg-accent")}
								icon={
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<UsersRound className="size-4" />
											</TooltipTrigger>
											<TooltipContent
												side="right"
												align="center"
												className="border p-2"
											>
												Students
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								}
							>
								<p className="text-[14px]">
									Students
								</p>
							</MenuItem>
						</Menu>


						{/* <Menu menuItemStyles={{
							button: {
								'&:hover': {
									backgroundColor: 'transparent', // removes hover color
								},
							},
						}}>
							<SubMenu
								className="cursor-pointer text-[14px]"
								icon={
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<Settings2 className="size-4" />
											</TooltipTrigger>
											<TooltipContent
												side="right"
												align="center"
												className="border p-2"
											>
												Setup
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								}
								label="Setup"
							>
								<MenuItem className="dark:bg-black">
									<Link
										className={cn(
											isActiveRoute("/hrm-module/department") && "bg-accent p-2 cursor-pointer",
											"flex items-center text-[13px] gap-2"
										)}
										href="/hrm-module/department"
									>
										<BriefcaseBusiness className="size-4" /> Department
									</Link>
								</MenuItem>
								<MenuItem className="dark:bg-black">
									<Link
										className={cn(
											isActiveRoute("/hrm-module/designation") && "bg-accent p-2 cursor-pointer",
											"flex items-center text-[13px] gap-2"
										)}
										href="/hrm-module/designation"
									>
										<Presentation className="size-4" /> Designation
									</Link>
								</MenuItem>
								<MenuItem className="dark:bg-black">
									<Link
										className={cn(
											isActiveRoute("/hrm-module/zone") && "bg-accent p-2 cursor-pointer",
											"flex items-center text-[13px] gap-2"
										)}
										href="/hrm-module/zone"
									>
										<MapPin className="size-4" /> Zone
									</Link>
								</MenuItem>
								<MenuItem className="dark:bg-black">
									<Link
										className={cn(
											isActiveRoute("/hrm-module/region") && "bg-accent p-2 cursor-pointer",
											"flex items-center text-[13px] gap-2"
										)}
										href="/hrm-module/region"
									>
										<Map className="size-4" /> Region
									</Link>
								</MenuItem>
								<MenuItem className="dark:bg-black">
									<Link
										className={cn(
											isActiveRoute("/hrm-module/market") && "bg-accent p-2 cursor-pointer",
											"flex items-center text-[13px] gap-2"
										)}
										href="/hrm-module/market"
									>
										<StoreIcon className="size-4" /> Market
									</Link>
								</MenuItem>
							</SubMenu>
						</Menu>
						<Menu menuItemStyles={{
							button: {
								'&:hover': {
									backgroundColor: 'transparent', // removes hover color
								},
							},
						}}>
							<SubMenu
								className="cursor-pointer text-[14px]"
								icon={
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<Wallet className="size-4" />
											</TooltipTrigger>
											<TooltipContent
												side="right"
												align="center"
												className="border p-2"
											>
												Payroll
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								}
								label="Payroll"
							>
								<MenuItem className="dark:bg-black">
									<Link
										className={cn(
											isActiveRoute("/hrm-module/salary-structure") && "bg-accent p-2 cursor-pointer",
											"flex items-center text-[13px] gap-2"
										)}
										href="/hrm-module/salary-structure"
									>
										<ChartLine className="size-4" /> Salary Structure
									</Link>
								</MenuItem>
							</SubMenu>
						</Menu> */}
					</>
				</div>
			</Sidebar >

			<div style={containerStyles}></div>
		</div >
	);
};

export default SidebarPage;
