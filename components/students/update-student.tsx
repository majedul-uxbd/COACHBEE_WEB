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
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
// import 'react-phone-number-input/style.css';
import { usePathname } from "next/navigation";
import { useTranslation } from "@/app/i18n/client";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { Checkbox } from "../ui/checkbox";

interface UpdateStudentProps {
    accessToken: any;
    studentData: any
    classes: any
    onUpdateTable(): void;
}
const UpdateStudent = ({ accessToken, studentData, classes, onUpdateTable }: UpdateStudentProps) => {
    const authToken = accessToken;
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [buttonDisable, setButtonDisable] = useState(false);
    const pathname = usePathname();
    const lng = pathname.split('/')[1];
    const { t } = useTranslation(lng, 'Language');

    let defaultClassValues: number[] = [];

    try {
        if (typeof studentData.class === "string") {
            defaultClassValues = JSON.parse(studentData.class);
        } else if (Array.isArray(studentData.class)) {
            defaultClassValues = studentData.class;
        }
    } catch {
        defaultClassValues = [];
    }

    const classMap = Object.fromEntries(
        classes.map((cls: any) => [cls.id, cls.class_name])
    );
    const UpdateSchema = z.object({
        fullName: z
            .string()
            .min(1, { message: t('fullname_is_required') })
            .max(100, { message: t('maximum_length_name') }),

        class: z.array(z.number()).min(1, { message: t("class_is_required") }),

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
            class: defaultClassValues,
            guardianPhone: studentData.guardian_phone || '',
            address: studentData.address || '',
            monthly_fee: studentData.monthly_fee || ""
        },
    });


    const onSubmit = async (values: z.infer<typeof UpdateSchema>) => {
        // console.log('🚀 ~ update-student.tsx:99 ~ values:', values);
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
                        <Edit className="h-4 w-4 text-green-600" />
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

                            {/* ✅ CLASS SELECT */}
                            <FormField
                                control={form.control}
                                name="class"
                                render={({ field }) => {
                                    const selectedValues = Array.isArray(field.value) ? field.value : [];

                                    return (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>{t("class")}</FormLabel>

                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            className="justify-between flex-wrap h-auto min-h-10"
                                                        >
                                                            {selectedValues.length > 0 ? (
                                                                <div className="flex flex-wrap gap-1">
                                                                    {selectedValues.map((id: number) => (
                                                                        <span
                                                                            key={id}
                                                                            className="bg-muted px-2 py-1 rounded text-xs"
                                                                        >
                                                                            {classMap[id]}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                "Select classes"
                                                            )}
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>

                                                <PopoverContent className="w-full p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Search classes..." />

                                                        <CommandList className="max-h-60 overflow-y-auto">
                                                            <CommandEmpty>No classes found</CommandEmpty>

                                                            <CommandGroup>
                                                                {classes.map((cls: any) => {
                                                                    const isSelected = selectedValues.includes(cls.id);

                                                                    return (
                                                                        <CommandItem
                                                                            key={cls.id}
                                                                            onSelect={() => {
                                                                                let updatedValues;

                                                                                if (isSelected) {
                                                                                    updatedValues = selectedValues.filter(
                                                                                        (v: number) => v !== cls.id
                                                                                    );
                                                                                } else {
                                                                                    updatedValues = [...selectedValues, cls.id];
                                                                                }

                                                                                field.onChange(updatedValues);
                                                                            }}
                                                                            className="flex items-center gap-2"
                                                                        >
                                                                            <Checkbox checked={isSelected} />
                                                                            {cls.class_name}
                                                                        </CommandItem>
                                                                    );
                                                                })}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>

                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
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