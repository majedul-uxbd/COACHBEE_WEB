import * as z from 'zod';

export const CreateSchema = z.object({
    region_name: z
        .string()
        .min(1, {
            message: 'Region name is required',
        })
        .max(100, {
            message: 'Maximum 100 characters allowed',
        }),
    market_id: z
        .string()
        .min(1, {
            message: 'Market ID is required',
        })
        .max(10, {
            message: 'Maximum 10 characters allowed',
        }),
    market_code: z
        .string()
        .min(1, {
            message: 'Market code is required',
        })
        .max(10, {
            message: 'Maximum 10 characters allowed',
        }),
    market_name: z
        .string()
        .min(1, {
            message: 'Market name is required',
        })
        .max(100, {
            message: 'Maximum 100 characters allowed',
        }),
    comment: z.string().max(500, {
        message: 'Maximum 500 characters allowed',
    }),
});

export const UpdateSchema = z.object({
    region_name: z
        .string()
        .min(1, {
            message: 'Region name is required',
        })
        .max(100, {
            message: 'Maximum 100 characters allowed',
        }),
    market_name: z
        .string()
        .min(1, {
            message: 'Market name is required',
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
