'use client'

import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, SquarePlus } from "lucide-react"
import { toast } from "sonner"
import { usePathname } from 'next/navigation'
import { useTranslation } from '@/app/i18n/client'

interface CreateStudentPaymentProps {
    session: string
    studentList: any[]
    onCreateSuccess: () => void
}

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
]

export default function CreateStudentPayment({ session, studentList, onCreateSuccess }: CreateStudentPaymentProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [buttonDisable, setButtonDisable] = useState(false)
    const pathname = usePathname();
    const lng = pathname.split('/')[1];
    const { t } = useTranslation(lng, 'Language');
    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 5 }, (_, i) => String(currentYear - i))

    // ✅ Schema
    const CreateSchema = z.object({
        studentId: z.string().min(1, "Student is required"),
        month: z.string().min(1, "Month is required"),
        year: z.string().min(1, "Year is required"),

        totalPayableAmount: z.number().min(0),
        paidAmount: z.number().min(0),
        dueAmount: z.number().min(0),

        paymentStatus: z.string().min(1)
    })

    const form = useForm<z.infer<typeof CreateSchema>>({
        resolver: zodResolver(CreateSchema),
        defaultValues: {
            studentId: "",
            month: "",
            year: String(currentYear),
            totalPayableAmount: 0,
            paidAmount: 0,
            dueAmount: 0,
            paymentStatus: "DUE"
        },
    })

    // ✅ Auto Calculate Due + Status
    const totalPayableAmount = useWatch({
        control: form.control,
        name: "totalPayableAmount"
    })
    const paidAmount = useWatch({
        control: form.control,
        name: "paidAmount"
    })

    useEffect(() => {
        const total = totalPayableAmount || 0
        const paid = paidAmount || 0

        // ❌ Prevent overpayment
        if (paid > total) {
            form.setValue("paidAmount", total)
            return
        }

        const due = total - paid
        form.setValue("dueAmount", due)

        // ✅ Auto status
        form.setValue("paymentStatus", due === 0 ? "PAID" : "DUE")
    }, [totalPayableAmount, paidAmount, form])

    const onSubmit = async (values: z.infer<typeof CreateSchema>) => {
        setButtonDisable(true)

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/payroll/create-student-payments`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${session}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            }
        )

        const data = await response.json()

        if (data.status === 'success') {
            toast.success(data.message)
            form.reset()
            onCreateSuccess()
            setIsDialogOpen(false)
        } else {
            toast.error(data.message)
        }

        setButtonDisable(false)
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-700 hover:bg-blue-800 dark:bg-blue-400 dark:hover:bg-blue-500">
                    <SquarePlus className="font-bold" size={20} />
                    {t('create_student_payment')}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-106">
                {/* Header Section */}
                <DialogHeader className="items-center">
                    <DialogTitle className="text-2xl font-semibold text-accent-foreground">
                        {t('create_student_payment')}
                    </DialogTitle>
                    <DialogDescription className="text-gray-500">
                        {t('create_student_payment_dialog_description')}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">

                        {/* Student */}
                        <FormField
                            control={form.control}
                            name="studentId"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>{t('student_name')}</FormLabel>
                                    <Select
                                        value={field.value}
                                        onValueChange={(value) => {
                                            field.onChange(value)

                                            // 🔥 Find selected student
                                            const selectedStudent = studentList.find(
                                                (s) => String(s.studentId) === value
                                            )

                                            // ✅ Set totalPayableAmount from student
                                            if (selectedStudent) {
                                                form.setValue(
                                                    "totalPayableAmount",
                                                    Number(selectedStudent.totalPayableAmount)
                                                )
                                            }
                                        }}
                                    >
                                        <FormControl className="w-full">
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select student" />
                                            </SelectTrigger>
                                        </FormControl>

                                        <SelectContent>
                                            {studentList.map((s) => (
                                                <SelectItem
                                                    key={s.studentId}
                                                    value={String(s.studentId)}
                                                >
                                                    {s.fullName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Month */}
                        <FormField
                            control={form.control}
                            name="month"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('month')}</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl className="w-full">
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('select_month')} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="w-full">
                                            {months.map((m) => (
                                                <SelectItem key={m} value={m}>{m}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        {/* Year */}
                        <FormField
                            control={form.control}
                            name="year"
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <FormLabel>{t('year')}</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl className="w-full">
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="w-full">
                                            {years.map((y) => (
                                                <SelectItem key={y} value={y}>{y}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        {/* Total Amount */}
                        <FormField
                            control={form.control}
                            name="totalPayableAmount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('total_payable_amount')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="w-full"
                                            type="number"
                                            value={field.value}
                                            onChange={(e) =>
                                                field.onChange(e.target.valueAsNumber || 0)
                                            }
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {/* Paid Amount */}
                        <FormField
                            control={form.control}
                            name="paidAmount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('paid_amount')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            value={field.value}
                                            onChange={(e) =>
                                                field.onChange(e.target.valueAsNumber || 0)
                                            }
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {/* Due Amount (Readonly) */}
                        <FormField
                            control={form.control}
                            name="dueAmount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('dues_amount')}</FormLabel>
                                    <FormControl>
                                        <Input

                                            type="number"
                                            value={field.value}
                                            readOnly
                                            className="bg-gray-100 "
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {/* Payment Status */}
                        <FormField
                            control={form.control}
                            name="paymentStatus"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('payment_status')}</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl className="w-full">
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="w-full">
                                            <SelectItem value="PAID">PAID</SelectItem>
                                            <SelectItem value="DUE">DUE</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        {/* Buttons */}
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
        </Dialog>
    )
}