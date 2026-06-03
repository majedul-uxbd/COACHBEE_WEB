export interface Teachers {
    id: number;
    full_name: string;
    class: string;
    phone: number;
    address: string;
    starting_month: string;
    salary: number;
    is_active: number;
    created_at: Date;
    updated_at: Date | null;
}
