import { isValidPhoneNumber } from 'react-phone-number-input';
import * as z from 'zod';

export const LoginSchema = z.object({
    email: z.string().email({
        message: 'Invalid email address',
    }),
    password: z.string().min(4, {
        message: 'Minimum 4 characters required',
    }),
});

export const RegisterSchema = z
    .object({
        firstName: z.string().min(4, {
            message: 'Minimum 4 characters required',
        }),
        lastName: z.string().min(4, {
            message: 'Minimum 4 characters required',
        }),
        email: z.string().email({
            message: 'Invalid email address',
        }),
        company: z.string().min(4, {
            message: 'Minimum 4 characters required',
        }),
        // position: z.enum(positionOptions as [string, ...string[]], {
        //     message: "Invalid position selected",
        // }),
        contact: z.string().refine((val) => isValidPhoneNumber(val), {
            message: 'Invalid phone number',
        }),
        password: z.string().min(6, {
            message: 'Minimum 6 characters required',
        }),
        confirmPassword: z.string().min(6, {
            message: 'Minimum 6 characters required',
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'], // Show the error message in the confirmPassword field
    });
