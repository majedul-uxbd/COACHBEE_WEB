export interface Employees {
    id: number;
    employee_id: string;
    full_name: string;
    username: string | null;
    email: string | null;
    contact: string;
    present_address: string;
    permanent_address: string;
    joining_date: string;
    nid_no: string;
    place_name: string | null;
    permanent_date: string | null;
    designation_name: string;
    department_name: string;
    depot_name: string;
    module_name: string;
    active_status: number;
    created_at: Date;
    modified_at: Date | null;
}
