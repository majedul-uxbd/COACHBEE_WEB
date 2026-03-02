'use client'

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Loader2, SquarePlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import 'react-phone-number-input/style.css';
import { usePathname } from "next/navigation";
import { useTranslation } from "@/app/i18n/client";

const ClassList = {
    "One": "one",
    "Two": "two",
    "Three": "three",
    "Four": "four",
    "Five": "five",
    "Six": "six",
    "Seven": "seven",
    "Eight": "eight",
    "Nine": "nine",
    "Ten": "ten",
    "Eleven": "eleven",
    "Twelve": "twelve"
}

interface UpdateStudentProps {
    accessToken: any;
    studentData: any
    onUpdateTable(): void;
}
const UpdateStudent = ({ accessToken, studentData, onUpdateTable }: UpdateStudentProps) => {
    const authToken = accessToken;
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [buttonDisable, setButtonDisable] = useState(false);
    const pathname = usePathname();
    const lng = pathname.split('/')[1];
    const { t } = useTranslation(lng, 'Language');
    const UpdateSchema = z.object({
        fullName: z
            .string()
            .min(1, { message: t('fullname_is_required') })
            .max(100, { message: t('maximum_length_name') }),

        class: z
            .string()
            .min(1, { message: t('class_is_required') })
            .max(60, { message: t('maximum_length_class') }),

        guardianPhone: z.string().refine((val) => isValidPhoneNumber(val), {
            message: t('invalid_phone_number'),
        }),

        address: z
            .string()
            .min(1, { message: t('address_is_required') })
            .max(200, { message: t('maximum_length_address') }),

        monthly_fee: z.string().min(1, {
            message: t('monthly_fee_is_required'),
        }),
    });

    const form = useForm<z.infer<typeof UpdateSchema>>({
        resolver: zodResolver(UpdateSchema),
        defaultValues: {
            fullName: studentData.full_name || '',
            class: studentData.class || '',
            guardianPhone: studentData.guardian_phone || '',
            address: studentData.address || '',
            monthly_fee: studentData.monthly_fee || ""
        },
    });


    const onSubmit = async (values: z.infer<typeof UpdateSchema>) => {
        console.log('🚀 ~ update-student.tsx:99 ~ values:', values);
        setButtonDisable(true);
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/students/update`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    lg: lng,
                    id: studentData.id,
                    fullName: values.fullName,
                    class: values.class,
                    guardianPhone: values.guardianPhone,
                    address: values.address,
                    monthly_fee: values.monthly_fee,
                }),
            }
        );

        const responseData = await response.json();
        console.log('🚀 ~ update-student.tsx:107 ~ responseData:', responseData);
        if (responseData.status === 'success') {
            toast.success(responseData?.message);
            form.reset();
            onUpdateTable();
            setIsDialogOpen(false);
        } else {
            toast.error(responseData.message);
        }
        setButtonDisable(false);
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    className="w-full flex justify-start text-left text-xs text-accent-foreground"
                >
                    <div className="flex items-center -ml-1.5 gap-2">
                        <Edit className="h-4 w-4" />
                        <span>{t("update")}</span>
                    </div>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-106">
                {/* Header Section */}
                <DialogHeader className="items-center">
                    <DialogTitle className="text-2xl font-semibold text-accent-foreground">
                        {t('update_student_dialog_title')}
                    </DialogTitle>
                    <DialogDescription className="text-gray-500">
                        {t('update_student_dialog_description')}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4  overflow-auto">
                            {/* Full Name Field */}
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('full_name')}</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder={t("full_name_hint")} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Class Field */}
                            <FormField
                                control={form.control}
                                name="class"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('class')}</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl className="w-full">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a Region" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.entries(ClassList).map(([key, value]) => (
                                                    <SelectItem key={key} value={value}>
                                                        {key}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Contact Number Field */}
                            <FormField
                                control={form.control}
                                name="guardianPhone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('guardian_phone')}</FormLabel>
                                        <FormControl>
                                            <PhoneInput
                                                {...field}
                                                placeholder={t('guardian_phone_hint')}
                                                value={field.value}
                                                onChange={(phone) => field.onChange(phone)}
                                                defaultCountry="BD"
                                                className="w-full p-2 text-sm border rounded-md"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Address Field */}
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('address')}</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder={t("address_hint")} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Monthly_Fees Field */}
                            <FormField
                                control={form.control}
                                name="monthly_fee"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('monthly_fee')}</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}

                                                placeholder={t('monthly_fee_hint')}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="w-full flex flex-row justify-between space-x-2">
                            <Button
                                className="w-1/2"
                                type="button"
                                variant='ghost'
                                onClick={() => setIsDialogOpen(false)}
                            >
                                {t('cancel')}
                            </Button>
                            <Button
                                className="w-1/2 flex items-center justify-center gap-2"
                                type="submit"
                                variant="default"
                                disabled={buttonDisable}
                            >
                                {buttonDisable ? t('updating') : t('update')}
                                {buttonDisable && (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                )}
                            </Button>

                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    );
}

export default UpdateStudent;