'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    formData.append('redirectTo', '/coachbee/en/home');
    try {
        const data = await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                default:
                    return 'Invalid credentials.';
            }
        }
        throw error;
    }
}
