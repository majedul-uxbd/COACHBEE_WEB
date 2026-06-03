import * as z from 'zod';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/app/i18n/client';

const pathname = usePathname();
const lng = pathname.split('/')[1];
const { t } = useTranslation(lng, 'Language');

export const CreateSchema = z.object({
    full_name: z
        .string()
        .min(1, {
            message: t('fullname_is_required'),
        })
        .max(100, {
            message: t('maximum_length_name'),
        }),
    class: z
        .string()
        .min(1, {
            message: t('class_is_required'),
        })
        .max(60, {
            message: t('maximum_length_class'),
        }),
    guardian_phone: z.string().refine((val) => isValidPhoneNumber(val), {
        message: t('invalid_phone_number'),
    }),
    address: z
        .string()
        .min(1, {
            message: t('address_is_required'),
        })
        .max(200, {
            message: t('maximum_length_address'),
        }),
    monthly_fee: z.number().min(1, {
        message: t('monthly_fee_is_required'),
    }),
});
