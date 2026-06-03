export interface TeacherSalary {
    teacherId: number;
    salaryId: number;
    uuid: string;
    fullName: string;
    class: string;
    month: string;
    year: string;
    bonus: number;
    totalPayableAmount: number;
    paidAmount: number;
    duesAmount: number;
    note: string;
    salaryStatus: string;
    salaryDate: Date;
    salaryUpdatedDate: Date | null;
}
