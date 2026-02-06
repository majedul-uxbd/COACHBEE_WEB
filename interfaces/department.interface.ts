export interface Department {
    id: number;
    department_id: string;
    department_code: string;
    department_name: string;
    comment: string | null;
    created_by: string;
    modified_by: string | null;
    active_status: number;
    created_at: Date;
    modified_at: Date | null;
}

export interface UpdateDepartment {
    id: number;
    department_id: string;
    department_code: string;
    department_name: string;
    comment: string | null;
}
