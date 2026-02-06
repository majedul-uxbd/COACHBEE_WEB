export interface Zone {
    id: number;
    depot_name: string;
    zone_id: string;
    zone_code: string;
    zone_name: string;
    comment: string | null;
    created_by: string;
    modified_by: string | null;
    active_status: number;
    created_at: Date;
    modified_at: Date | null;
}

export interface UpdateZone {
    id: number;
    depot_name: string;
    zone_name: string;
    comment: string | null;
}
