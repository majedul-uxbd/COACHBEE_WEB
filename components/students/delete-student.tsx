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
import { CheckCircle, Trash2, XCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/app/i18n/client";

interface DeleteStudentDialogProps {
	accessToken: any;
	id: number;
	onUpdateTable: () => void;
}

const DeleteStudentDialog = ({
	onUpdateTable,
	accessToken,
	id,
}: DeleteStudentDialogProps) => {
	const [loading, setLoading] = React.useState(false);
	const [open, setOpen] = React.useState(false);

	const pathname = usePathname();
	const lng = pathname.split("/")[1];
	const { t } = useTranslation(lng, "Language");

	const handleNotify = async () => {
		try {
			setLoading(true);

			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/students/delete`,
				{
					lg: lng,
					id: id,
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
					<div className="flex items-center -ml-1.5 gap-2">
						<Trash2 className="h-4 w-4 text-red-600" />
						<span>{t("delete")}</span>
					</div>
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>{t("delete_student_dialog_title")}</DialogTitle>
					<DialogDescription>
						{t("delete_student_dialog_description")}
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

					<Button type="submit" variant="destructive" disabled={loading} onClick={handleNotify}>
						{loading ? t("deleting") : t("delete")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default DeleteStudentDialog;
