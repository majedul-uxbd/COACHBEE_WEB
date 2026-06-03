export interface StudentPayments {
    studentId: number;
    paymentId: number;
    uuid: string;
    fullName: string;
    class: string;
    month: string;
    year: string;
    totalPayableAmount: number;
    paidAmount: number;
    duesAmount: number;
    paymentStatus: string;
    paymentDate: Date;
    paymentUpdatedDate: Date | null;
}
