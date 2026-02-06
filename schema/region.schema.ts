import * as z from 'zod';

export const CreateSchema = z.object({
    zone_name: z
        .string()
        .min(1, {
            message: 'Zone name is required',
        })
        .max(100, {
            message: 'Maximum 100 characters allowed',
        }),
    region_id: z
        .string()
        .min(1, {
            message: 'Region ID is required',
        })
        .max(10, {
            message: 'Maximum 10 characters allowed',
        }),
    region_code: z
        .string()
        .min(1, {
            message: 'Region code is required',
        })
        .max(10, {
            message: 'Maximum 10 characters allowed',
        }),
    region_name: z
        .string()
        .min(1, {
            message: 'Region name is required',
        })
        .max(100, {
            message: 'Maximum 100 characters allowed',
        }),
    comment: z.string().max(500, {
        message: 'Maximum 500 characters allowed',
    }),
});

export const UpdateSchema = z.object({
    zone_name: z
        .string()
        .min(1, {
            message: 'Zone name is required',
        })
        .max(100, {
            message: 'Maximum 100 characters allowed',
        }),
    region_name: z
        .string()
        .min(1, {
            message: 'Region name is required',
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
