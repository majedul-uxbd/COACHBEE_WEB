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
import { Edit, Loader2, SquarePlus } from "lucide-react"
import { toast } from "sonner"
import { usePathname } from 'next/navigation'
import { useTranslation } from '@/app/i18n/client'
import { StudentPayments } from '@/interfaces/student-payment.interface'

interface CreateStudentPaymentProps {
    accessToken: any
    paymentData: any
    onUpdateTable: () => void
}

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
]

const UpdateStudentPayment = ({ accessToken, paymentData, onUpdateTable }: CreateStudentPaymentProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [buttonDisable, setButtonDisable] = useState(false)
    const pathname = usePathname();
    const lng = pathname.split('/')[1];
    const { t } = useTranslation(lng, 'Language');
    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 5 }, (_, i) => String(currentYear - i))

    // ✅ Schema
    const UpdateSchema = z.object({
        studentId: z.string().min(1, "Student is required"),
        month: z.string().min(1, "Month is required"),
        year: z.string().min(1, "Year is required"),
        totalPayableAmount: z.number().min(0),
        paidAmount: z.number().min(1, { message: t("please_enter_paid_amount") }), // ✅ Paid amount must be at least 1
        dueAmount: z.number().min(0),
        paymentStatus: z.string().min(1)
    })

    const form = useForm<z.infer<typeof UpdateSchema>>({
        resolver: zodResolver(UpdateSchema),
        defaultValues: {
            studentId: paymentData.fullName,
            month: paymentData.month,
            year: paymentData.year,
            totalPayableAmount: paymentData.totalPayableAmount,
            paidAmount: paymentData.paidAmount,
            dueAmount: paymentData.dueAmount,
            paymentStatus: paymentData.paymentStatus
        },
    })

    // ✅ Reset form when dialog opens (important)
    useEffect(() => {
        if (isDialogOpen) {
            form.reset({
                studentId: String(paymentData.fullName),
                month: paymentData.month,
                year: String(paymentData.year),
                totalPayableAmount: Number(paymentData.totalPayableAmount),
                paidAmount: Number(paymentData.paidAmount),
                dueAmount: Number(paymentData.dueAmount),
                paymentStatus: paymentData.paymentStatus
            })
        }
    }, [isDialogOpen, paymentData, form])

    // ✅ Auto calculation
    const total = useWatch({ control: form.control, name: "totalPayableAmount" })
    const paid = useWatch({ control: form.control, name: "paidAmount" })

    useEffect(() => {
        const t = total || 0
        const p = paid || 0

        if (p > t) {
            form.setValue("paidAmount", t)
            return
        }

        const due = t - p
        form.setValue("dueAmount", due)
        form.setValue("paymentStatus", due === 0 ? "PAID" : "DUE")

    }, [total, paid, form])

    // ✅ Submit (UPDATE API)
    const onSubmit = async (values: z.infer<typeof UpdateSchema>) => {
        console.log('🚀 ~ update-student-payment.tsx:100 ~ values:', values);
        setButtonDisable(true)

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/payroll/update-student-payment`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    lg: lng,
                    studentId: paymentData.studentId, // ✅ Needed to identify which payment to update
                    month: values.month,
                    year: values.year,
                    totalPayableAmount: values.totalPayableAmount,
                    paidAmount: values.paidAmount,
                    dueAmount: values.dueAmount,
                    paymentStatus: values.paymentStatus
                }),
            }
        )

        const data = await response.json()

        if (data.status === 'success') {
            toast.success(data.message)
            onUpdateTable()
            setIsDialogOpen(false)
        } else {
            toast.error(data.message)
        }

        setButtonDisable(false)
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    className="w-full flex justify-start text-left text-xs text-accent-foreground"
                >
                    <div className="flex items-center -ml-1.5 gap-2">
                        <Edit className="h-4 w-4 text-green-600" />
                        <span>{t("update_student_payment")}</span>
                    </div>
                </Button>
            </DialogTrigger>

            <DialogContent className="w-full max-w-lg h-[85vh] flex flex-col">
                <DialogHeader className="items-center">
                    <DialogTitle className="text-2xl font-semibold">
                        {t('update_student_payment')}
                    </DialogTitle>
                    <DialogDescription>
                        {t('update_student_payment_dialog_description')}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full overflow-y-auto pr-2 flex-1">

                        {/* Student */}
                        <FormField
                            control={form.control}
                            name="studentId"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>{t('student_name')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled
                                            className="bg-gray-100"
                                        />
                                    </FormControl>
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
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled
                                            className="bg-gray-100"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {/* Year */}
                        <FormField
                            control={form.control}
                            name="year"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('year')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled
                                            className="bg-gray-100"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {/* Payable Amounts */}
                        <FormField
                            control={form.control}
                            name="totalPayableAmount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('total_payable_amount')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            value={field.value}
                                            disabled
                                            className="bg-gray-100"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />


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
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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
                                            className="bg-gray-100"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="paymentStatus"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('payment_status')}</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full" disabled>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="PAID">PAID</SelectItem>
                                            <SelectItem value="DUE">DUE</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        {/* Buttons */}
                        <DialogFooter className="w-full flex gap-2">
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
        </Dialog>
    )
}

export default UpdateStudentPayment