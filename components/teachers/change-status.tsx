"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import axios from "axios";
import { toast } from "sonner";
import { CheckCircle, XCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/app/i18n/client";

interface ChangeStatusDialogProps {
	accessToken: any;
	id: number;
	statusCode: number;
	onUpdateTable: () => void;
}

const ChangeStatusDialog = ({
	onUpdateTable,
	accessToken,
	id,
	statusCode,
}: ChangeStatusDialogProps) => {
	const [loading, setLoading] = React.useState(false);
	const [open, setOpen] = React.useState(false);

	const pathname = usePathname();
	const lng = pathname.split("/")[1];
	const { t } = useTranslation(lng, "Language");

	const handleNotify = async () => {
		try {
			setLoading(true);

			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/teachers/change-status`,
				{
					lg: lng,
					id: id,
					statusCode: statusCode,
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${accessToken}`
					},
				}
			);

			toast.success(response.data.message || "Status changed successfully");
			setOpen(false);
			onUpdateTable();
		} catch (error: any) {
			console.error("Failed to add employee", error);

			if (error.response && error.response.data) {
				const msg =
					error.response.data.message ||
					(error.response.data.errors &&
						Object.values(error.response.data.errors)[0]) ||
					"Something went wrong";
				toast.error(msg);
			} else {
				toast.error(error.message || "Something went wrong");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					className="w-full flex justify-start text-left text-xs text-accent-foreground"
				>
					{statusCode === 1 ? (
						<div className="flex items-center -ml-1.5 gap-2 ">
							<CheckCircle className="h-4 w-4 text-cyan-600" />
							<span>{t("active")}</span>
						</div>
					) : (
						<div className="flex items-center -ml-1.5 gap-2">
							<XCircle className="h-4 w-4 text-red-600" />
							<span>{t("inactive")}</span>
						</div>
					)}
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>{t("teacher_status_dialog_title")}</DialogTitle>
					<DialogDescription>
						{t("teacher_status_dialog_description")}
					</DialogDescription>
				</DialogHeader>

				<DialogFooter>
					<DialogClose asChild>
						<Button
							variant="secondary"
							onClick={() => {
								setOpen(false);
							}}
						>
							{t("cancel")}
						</Button>
					</DialogClose>

					<Button type="submit" disabled={loading} onClick={handleNotify}>
						{loading ? t("changing") : t("change")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default ChangeStatusDialog;
