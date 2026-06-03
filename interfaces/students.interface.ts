export interface Students {
    id: number;
    full_name: string;
    class: string;
    guardian_phone: number;
    address: string;
    starting_month: string;
    monthly_fee: number;
    is_active: number;
    created_at: Date;
    updated_at: Date | null;
}


export interface StudentList {
    id: number;
    full_name: string;
    totalPayableAmount: number;
}