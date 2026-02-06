export interface Designation {
    id: number;
    designation_id: string;
    designation_code: string;
    designation_name: string;
    description: string | null;
    comment: string | null;
    created_by: string;
    modified_by: string | null;
    active_status: number;
    created_at: Date;
    modified_at: Date | null;
}

export interface UpdateDesignation {
    id: number;
    designation_id: string;
    designation_code: string;
    designation_name: string;
    description: string | null;
    comment: string | null;
}
