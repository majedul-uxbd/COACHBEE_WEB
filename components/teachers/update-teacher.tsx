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
import 'react-phone-number-input/style.css';
import { usePathname } from "next/navigation";
import { useTranslation } from "@/app/i18n/client";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { Checkbox } from "../ui/checkbox";

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

interface UpdateTeacherProps {
    accessToken: any;
    teacherData: any
    onUpdateTable(): void;
}
const UpdateTeacher = ({ accessToken, teacherData, onUpdateTable }: UpdateTeacherProps) => {
    const authToken = accessToken;
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [buttonDisable, setButtonDisable] = useState(false);
    const pathname = usePathname();
    const lng = pathname.split('/')[1];
    const { t } = useTranslation(lng, 'Language');
    const defaultClassValues = Array.isArray(teacherData.class)
        ? teacherData.class.map((c: string) => c.toLowerCase().trim())
        : teacherData.class
            ? [teacherData.class.toLowerCase().trim()]
            : [];

    const UpdateSchema = z.object({
        fullName: z
            .string()
            .min(1, { message: t('fullname_is_required') })
            .max(100, { message: t('maximum_length_name') }),

        class: z
            .array(
                z
                    .string()
                    // .min(1, { message: t("class_is_required") })
                    .max(150, { message: t("maximum_length_class") })
            )
        // .min(1, { message: t("class_is_required") }),
        ,
        phone: z.string().refine((val) => isValidPhoneNumber(val), {
            message: t('invalid_phone_number'),
        }),

        address: z
            .string()
            .min(1, { message: t('address_is_required') })
            .max(200, { message: t('maximum_length_address') }),

        salary: z.string()
    });

    const form = useForm<z.infer<typeof UpdateSchema>>({
        resolver: zodResolver(UpdateSchema),
        defaultValues: {
            fullName: teacherData.full_name || '',
            class: defaultClassValues,
            phone: teacherData.phone || '',
            address: teacherData.address || '',
            salary: teacherData.salary || ""
        },
    });


    const onSubmit = async (values: z.infer<typeof UpdateSchema>) => {
        setButtonDisable(true);
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/teachers/update`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    lg: lng,
                    id: teacherData.id,
                    fullName: values.fullName,
                    class: values.class,
                    phone: values.phone,
                    address: values.address,
                    salary: values.salary,
                }),
            }
        );

        const responseData = await response.json();
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
                <Button variant="ghost" className="w-full flex justify-start text-left text-xs text-accent-foreground">
                    <div className="flex items-center -ml-1.5 gap-2">
                        <Edit className="h-4 w-4" />
                        <span>{t("update")}</span>
                    </div>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-106">
                <DialogHeader className="items-center">
                    <DialogTitle className="text-2xl font-semibold text-accent-foreground">
                        {t('update_teacher_dialog_title')}
                    </DialogTitle>
                    <DialogDescription className="text-gray-500">
                        {t('update_teacher_dialog_description')}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4 overflow-auto">

                            {/* Full Name */}
                            <FormField control={form.control} name="fullName" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('full_name')}</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder={t("full_name_hint")} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            {/* Class */}
                            <FormField control={form.control} name="class" render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>{t("class")}</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button variant="outline" role="combobox" className="justify-between">
                                                    {field.value.length ? field.value.join(", ") : "Select classes"}
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0 max-h-60">
                                            <Command>
                                                <CommandInput placeholder="Search classes..." />
                                                <CommandList>
                                                    <CommandEmpty>No classes found</CommandEmpty>
                                                    <CommandGroup className="grid grid-cols-2 gap-2">
                                                        {Object.entries(ClassList).map(([key, value]) => {
                                                            const isSelected = Array.isArray(field.value) && field.value.includes(value);
                                                            return (
                                                                <CommandItem
                                                                    key={value}
                                                                    onSelect={() => {
                                                                        if (isSelected) {
                                                                            field.onChange(field.value.filter(v => v !== value));
                                                                        } else {
                                                                            field.onChange([...field.value, value]);
                                                                        }
                                                                    }}
                                                                    className="flex items-center"
                                                                >
                                                                    <Checkbox checked={isSelected} className="mr-2" />
                                                                    {key}
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
                            )} />

                            {/* Phone */}
                            <FormField control={form.control} name="phone" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('phone')}</FormLabel>
                                    <FormControl>
                                        <PhoneInput
                                            {...field}
                                            placeholder={t('phone_hint')}
                                            value={field.value}
                                            onChange={field.onChange}
                                            defaultCountry="BD"
                                            className="w-full p-2 text-sm border rounded-md"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            {/* Address */}
                            <FormField control={form.control} name="address" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('address')}</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder={t("address_hint")} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            {/* Salary */}
                            <FormField control={form.control} name="salary" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('salary')}</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder={t('salary_hint')} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                        </div>
                        <DialogFooter className="w-full flex flex-row justify-between space-x-2">
                            <Button className="w-1/2" type="button" variant='ghost' onClick={() => setIsDialogOpen(false)}>
                                {t('cancel')}
                            </Button>
                            <Button className="w-1/2 flex items-center justify-center gap-2" type="submit" variant="default" disabled={buttonDisable}>
                                {buttonDisable ? t('updating') : t('update')}
                                {buttonDisable && <Loader2 className="h-4 w-4 animate-spin" />}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default UpdateTeacher;