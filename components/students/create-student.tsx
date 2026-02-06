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
import { CreateSchema } from "@/schema/employee.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SquarePlus } from "lucide-react";
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

interface CreateStudentProps {
    session: any;
    onCreateSuccess(): void;
}
const CreateStudent = ({
    session, onCreateSuccess }: CreateStudentProps) => {
    const authToken = session?.id;
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [buttonDisable, setButtonDisable] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const pathname = usePathname();
    const lng = pathname.split('/')[1];
    const { t } = useTranslation(lng, 'Language');
    const CreateSchema = z.object({
        full_name: z
            .string()
            .min(1, {
                message: t('fullname_is_required'),
            })
            .max(100, {
                message: t('maximum_length_name'),
            }),
        class: z
            .string()
            .min(1, {
                message: t('class_is_required'),
            })
            .max(60, {
                message: t('maximum_length_class'),
            }),
        guardian_phone: z.string().refine((val) => isValidPhoneNumber(val), {
            message: t('invalid_phone_number'),
        }),
        address: z
            .string()
            .min(1, {
                message: t('address_is_required'),
            })
            .max(200, {
                message: t('maximum_length_address'),
            }),
        monthly_fee: z.number().min(1, {
            message: t('monthly_fee_is_required'),
        }),
    });
    const form = useForm<z.infer<typeof CreateSchema>>({
        resolver: zodResolver(CreateSchema),
        defaultValues: {
            full_name: '',
            class: '',
            guardian_phone: '',
            address: '',
            monthly_fee: 0
        },
    });


    const onSubmit = async (values: z.infer<typeof CreateSchema>) => {
        setButtonDisable(true);
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/employees/add-employee`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            }
        );

        const responseData = await response.json();
        if (responseData.status === 'success') {
            toast.success(responseData?.message);
            form.reset();
            // onCreateSuccess();
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

                <>
                    {/* Header Section */}
                    <DialogHeader className="text-center">
                        <DialogTitle className="text-2xl font-semibold text-gray-800">
                            {t('create_student')}
                        </DialogTitle>
                        <DialogDescription className="text-gray-500">
                            Fill in the details below to create a new Student.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-4  overflow-auto">
                                {/* Full Name Field */}
                                <FormField
                                    control={form.control}
                                    name="full_name"
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
                                    name="guardian_phone"
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
                                    className="w-1/2"
                                    type="submit"
                                    variant='default'
                                    disabled={buttonDisable}
                                >
                                    {buttonDisable ? t('creating') : t('create')}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </>
            </DialogContent>
        </Dialog >
    );
}

export default CreateStudent;