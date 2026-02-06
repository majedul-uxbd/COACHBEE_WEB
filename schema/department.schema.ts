import * as z from 'zod';

export const CreateSchema = z.object({
    department_id: z
        .string()
        .min(1, {
            message: 'Department ID is required',
        })
        .max(10, {
            message: 'Maximum 10 characters allowed',
        }),
    department_code: z
        .string()
        .min(1, {
            message: 'Department code is required',
        })
        .max(10, {
            message: 'Maximum 10 characters allowed',
        }),
    department_name: z
        .string()
        .min(1, {
            message: 'Department name is required',
        })
        .max(100, {
            message: 'Maximum 100 characters allowed',
        }),
    comment: z.string().max(500, {
        message: 'Maximum 500 characters allowed',
    }),
});

export const UpdateSchema = z.object({
    department_id: z
        .string()
        .min(1, {
            message: 'Department ID is required',
        })
        .max(10, {
            message: 'Maximum 10 characters allowed',
        }),
    department_code: z
        .string()
        .min(1, {
            message: 'Department code is required',
        })
        .max(10, {
            message: 'Maximum 10 characters allowed',
        }),
    department_name: z
        .string()
        .min(1, {
            message: 'Department name is required',
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
