import * as z from 'zod';

export const CreateSchema = z.object({
    depot_name: z
        .string()
        .min(1, {
            message: 'Zone code is required',
        })
        .max(100, {
            message: 'Maximum 100 characters allowed',
        }),
    zone_id: z
        .string()
        .min(1, {
            message: 'Zone ID is required',
        })
        .max(10, {
            message: 'Maximum 10 characters allowed',
        }),
    zone_code: z
        .string()
        .min(1, {
            message: 'Zone code is required',
        })
        .max(10, {
            message: 'Maximum 10 characters allowed',
        }),
    zone_name: z
        .string()
        .min(1, {
            message: 'Zone name is required',
        })
        .max(100, {
            message: 'Maximum 100 characters allowed',
        }),
    comment: z.string().max(500, {
        message: 'Maximum 500 characters allowed',
    }),
});

export const UpdateSchema = z.object({
    depot_name: z
        .string()
        .min(1, {
            message: 'Depot name is required',
        })
        .max(100, {
            message: 'Maximum 100 characters allowed',
        }),
    zone_name: z
        .string()
        .min(1, {
            message: 'Zone name is required',
        })
        .max(100, {
            message: 'Maximum 100 characters allowed',
        }),
    comment: z
        .string()
        .max(500, {
            message: 'Maximum 500 characters allowed',
        })
        .nullable(),
});
