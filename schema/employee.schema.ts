import * as z from 'zod';
import { isValidPhoneNumber } from "react-phone-number-input";

export const CreateSchema = z.object({
    employee_id: z
        .string()
        .min(1, {
            message: 'Employee ID is required',
        }),
    full_name: z
        .string()
        .min(1, {
            message: 'Employee full name is required',
        })
        .max(100, {
            message: 'Maximum 100 characters allowed',
        }),
    username: z
        .string()
        .min(1, {
            message: 'Username is required',
        })
        .max(60, {
            message: 'Maximum 60 characters allowed',
        }),
    email: z
        .string()
        .email({
            message: 'Valid email is required',
        }),
    contact: z.string().refine((val) => isValidPhoneNumber(val), {
        message: "Invalid phone number",
    }),
    present_address: z
        .string()
        .min(1, {
            message: 'Present address is required',
        })
        .max(150, {
            message: 'Maximum 150 characters allowed',
        }),
    permanent_address: z
        .string()
        .min(1, {
            message: 'Permanent address is required',
        })
        .max(150, {
            message: 'Maximum 150 characters allowed',
        }),
    joining_date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Invalid date format (YYYY-MM-DD required)" }),
    permanent_date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")
        .optional()
        .or(z.literal("")),
    posting_place: z
        .string()
        .min(1, {
            message: 'Posting place is required',
        })
        .max(150, {
            message: 'Maximum 150 characters allowed',
        }),
    nid_no: z
        .string()
        .min(1, {
            message: 'NID no is required',
        })
        .max(17, {
            message: 'Maximum 17 characters allowed',
        }),
    module_name: z
        .string()
        .min(1, {
            message: 'Module name is required',
        })
        .max(10, {
            message: 'Maximum 10 characters allowed',
        }),
    depot_name: z
        .string()
        .min(1, {
            message: 'Module name is required',
        })
        .max(10, {
            message: 'Maximum 10 characters allowed',
        }),
    designation_name: z
        .string()
        .min(1, {
            message: 'Designation name is required',
        })
        .max(10, {
            message: 'Maximum 10 characters allowed',
        }),
    department_name: z
        .string()
        .min(1, {
            message: 'Department name is required',
        })
        .max(10, {
            message: 'Maximum 10 characters allowed',
        }),
    password: z.string().min(6, {
        message: "Minimum 6 characters required",
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
