"use client";

import {
	CircleDollarSign,
	LayoutDashboard,
	MenuIcon,
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
import TeacherIcon from "../shared/set-teachers-icons";
import { useTranslation } from "@/app/i18n/client";
import TeachersSalaryIcon from "../shared/set-teachers-salary-icons";

interface SidebarPageProps {
	session: any;
}

const SidebarPage = ({ session }: SidebarPageProps) => {
	const [collapsed, setCollapsed] = useState<boolean | null>(null);
	const [isMobile, setIsMobile] = useState(false);
	const pathname = usePathname(); // Get the current path
	const lng = pathname.split("/")[1];
	const { t } = useTranslation(lng, "Language");

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
		<div className="z-40 border">
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
								component={<Link href={`/${lng}/home`} />}
								className={cn(isActiveRoute(`/${lng}/home`) && "bg-accent")}
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
												{t("sidebar.dashboard")}
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								}
							>
								<p className="text-[14px]">
									{t("sidebar.dashboard")}
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
								component={<Link href={`/${lng}/teachers`} />}
								className={cn(isActiveRoute(`/${lng}/teachers`) && "bg-accent")}
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
												{t("sidebar.teachers")}
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								}
							>
								<p className="text-[14px]">
									{t("sidebar.teachers")}
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
								component={<Link href={`/${lng}/students`} />}
								className={cn(isActiveRoute(`/${lng}/students`) && "bg-accent")}
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
												{t("sidebar.students")}
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								}
							>
								<p className="text-[14px]">
									{t("sidebar.students")}
								</p>
							</MenuItem>
						</Menu>

						{/* Payroll SubMenu */}
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
												{t("sidebar.payroll")}
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								}
								label={t("sidebar.payroll")}
							>
								{/* Student Fees */}
								{/* <TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild> */}
								<MenuItem className="dark:bg-black">
									<Link
										className={cn(
											isActiveRoute(`/${lng}/student-payment`) && "bg-accent p-2 cursor-pointer",
											"flex items-center text-[13px] gap-2"
										)}
										href={`/${lng}/student-payment`}
									>
										<CircleDollarSign className="size-4" /> {t("sidebar.student_payments")}
									</Link>
								</MenuItem>
								{/* </TooltipTrigger>
										<TooltipContent>
											{t("sidebar.student_payments")}
										</TooltipContent>
									</Tooltip>
								</TooltipProvider> */}

								{/* Teachers Salary */}
								{/* <TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild> */}
								<MenuItem className="dark:bg-black">
									<Link
										className={cn(
											isActiveRoute(`/${lng}/teachers-salary`) && "bg-accent p-2 cursor-pointer",
											"flex items-center text-[13px] gap-2"
										)}
										href={`/${lng}/teachers-salary`}
									>
										<TeachersSalaryIcon />{t("sidebar.teachers_salary")}
									</Link>
								</MenuItem>
								{/* </TooltipTrigger>
										<TooltipContent>
											{t("sidebar.teachers_salary")}
										</TooltipContent>
									</Tooltip>
								</TooltipProvider> */}
							</SubMenu>
						</Menu>
					</>
				</div>
			</Sidebar >

			<div style={containerStyles}></div>
		</div >
	);
};

export default SidebarPage;
