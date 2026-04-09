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
import { Loader2, SquarePlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import 'react-phone-number-input/style.css';
import { usePathname } from "next/navigation";
import { useTranslation } from "@/app/i18n/client";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { Checkbox } from "../ui/checkbox";

interface CreateStudentProps {
    session: any;
    classes: any;
    onCreateSuccess(): void;
}
const CreateStudent = ({
    session, classes, onCreateSuccess }: CreateStudentProps) => {
    const authToken = session;
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [buttonDisable, setButtonDisable] = useState(false);
    const pathname = usePathname();
    const lng = pathname.split('/')[1];
    const { t } = useTranslation(lng, 'Language');
    const CreateSchema = z.object({
        fullName: z
            .string()
            .min(1, { message: t('fullname_is_required') })
            .max(100, { message: t('maximum_length_name') }),

        class: z.array(
            z.number()
        ).min(1, { message: t("class_is_required") }),

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

    const form = useForm<z.infer<typeof CreateSchema>>({
        resolver: zodResolver(CreateSchema),
        defaultValues: {
            fullName: '',
            class: [],
            guardianPhone: '',
            address: '',
            monthly_fee: ""
        },
    });


    const onSubmit = async (values: z.infer<typeof CreateSchema>) => {
        console.log('🚀 ~ create-student.tsx:99 ~ values:', values);
        setButtonDisable(true);
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/students/create`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    lg: lng,
                    fullName: values.fullName,
                    class: values.class,
                    guardianPhone: values.guardianPhone,
                    address: values.address,
                    monthly_fee: values.monthly_fee
                }),
            }
        );

        const responseData = await response.json();
        // console.log('🚀 ~ create-student.tsx:107 ~ responseData:', responseData);
        if (responseData.status === 'success') {
            toast.success(responseData?.message);
            form.reset();
            onCreateSuccess();
            setIsDialogOpen(false);
        } else {
            toast.error(responseData.message);
        }
        setButtonDisable(false);
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-700 hover:bg-blue-800 dark:bg-blue-400 dark:hover:bg-blue-500">
                    <SquarePlus className="font-bold" size={20} />
                    {t('create_student')}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-106">
                {/* Header Section */}
                <DialogHeader className="items-center">
                    <DialogTitle className="text-2xl font-semibold text-accent-foreground">
                        {t('create_student')}
                    </DialogTitle>
                    <DialogDescription className="text-gray-500">
                        {t('create_student_dialog_description')}
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
                                    <FormItem className="flex flex-col">
                                        <FormLabel>{t("class")}</FormLabel>

                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className="justify-between"
                                                    >
                                                        {field.value?.length ? field.value.join(", ") : "Select classes"}
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>

                                            <PopoverContent className="w-full p-0 max-h-60">
                                                <Command>
                                                    {/* Search input */}
                                                    <CommandInput placeholder="Search classes..." />
                                                    <CommandList>
                                                        <CommandEmpty>No classes found</CommandEmpty>
                                                        <CommandGroup className="grid grid-cols-2 gap-2">
                                                            {classes.map((cls: any) => {
                                                                const isSelected = field.value?.includes(cls.id);
                                                                return (
                                                                    <CommandItem
                                                                        key={cls.id}
                                                                        onSelect={() =>
                                                                            isSelected
                                                                                ? field.onChange(field.value.filter((v: number) => v !== cls.id))
                                                                                : field.onChange([...(field.value || []), cls.id])
                                                                        }
                                                                        className="flex items-center"
                                                                    >
                                                                        <Checkbox checked={isSelected} className="mr-2" />
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

                            {/* Address Field */}
                            <FormField
                                control={form.control}
                                name="monthly_fee"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('monthly_fee')}</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="number"
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
                                {buttonDisable ? t('creating') : t('create')}
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

export default CreateStudent;